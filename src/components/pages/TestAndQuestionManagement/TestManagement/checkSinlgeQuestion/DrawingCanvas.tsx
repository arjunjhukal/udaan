import { Redo, Undo } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { Brush2, Eraser, Trash } from 'iconsax-reactjs';
import { type MouseEvent, useEffect, useRef, useState } from 'react';

type Tool = 'pen' | 'eraser';

interface Image {
  id: number;
  url: string;
}

interface DrawingCanvasProps {
  images?: Image[];
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ images = [] }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [tool, setTool] = useState<Tool>('pen');
  const [color, setColor] = useState<string>('#000000');
  const [lineWidth, setLineWidth] = useState<number>(3);
  const [history, setHistory] = useState<string[]>([]);
  const [historyStep, setHistoryStep] = useState<number>(-1);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [imagesLoaded, setImagesLoaded] = useState<boolean>(false);

  // Debug: Log images
  useEffect(() => {
    console.log('Images received:', images);
    console.log('Number of images:', images.length);
  }, [images]);

  // Load and render images on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = 400;

    setContext(ctx);

    // Load images if provided
    if (images.length > 0) {
      loadImageToCanvas(images[selectedImageIndex].url, ctx, canvas);
    } else {
      // Set initial white background if no images
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      setImagesLoaded(true);
      saveState();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update canvas when selected image changes
  useEffect(() => {
    if (!context || !canvasRef.current || images.length === 0) return;

    loadImageToCanvas(images[selectedImageIndex].url, context, canvasRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedImageIndex]);

  const loadImageToCanvas = (
    imageUrl: string,
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ): void => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Handle CORS if needed

    img.onload = () => {
      // Clear canvas
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Calculate dimensions to fit image while maintaining aspect ratio
      const scale = Math.min(
        canvas.width / img.width,
        canvas.height / img.height
      );

      const x = (canvas.width - img.width * scale) / 2;
      const y = (canvas.height - img.height * scale) / 2;

      // Draw image centered
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

      setImagesLoaded(true);
      saveState();
    };

    img.onerror = () => {
      console.error('Failed to load image:', imageUrl);
      // Fallback to white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      setImagesLoaded(true);
      saveState();
    };

    img.src = imageUrl;
  };

  const saveState = (): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const imageData = canvas.toDataURL();
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(imageData);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const startDrawing = (e: MouseEvent<HTMLCanvasElement>): void => {
    const canvas = canvasRef.current;
    if (!canvas || !context || !imagesLoaded) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    context.beginPath();
    context.moveTo(x, y);

    if (tool === 'pen') {
      context.strokeStyle = color;
      context.lineWidth = lineWidth;
      context.lineCap = 'round';
      context.lineJoin = 'round';
    } else if (tool === 'eraser') {
      context.strokeStyle = '#ffffff';
      context.lineWidth = lineWidth * 3;
      context.lineCap = 'round';
      context.lineJoin = 'round';
    }
  };

  const draw = (e: MouseEvent<HTMLCanvasElement>): void => {
    if (!isDrawing || !context) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    context.lineTo(x, y);
    context.stroke();
  };

  const stopDrawing = (): void => {
    if (isDrawing && context) {
      setIsDrawing(false);
      context.closePath();
      saveState();
    }
  };

  const undo = (): void => {
    if (historyStep > 0) {
      const newStep = historyStep - 1;
      setHistoryStep(newStep);
      restoreCanvas(history[newStep]);
    }
  };

  const redo = (): void => {
    if (historyStep < history.length - 1) {
      const newStep = historyStep + 1;
      setHistoryStep(newStep);
      restoreCanvas(history[newStep]);
    }
  };

  const restoreCanvas = (dataUrl: string): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  };

  const clearCanvas = (): void => {
    const canvas = canvasRef.current;
    if (!canvas || !context) return;

    // Just clear the drawing layer (canvas is transparent, image shows through background)
    context.clearRect(0, 0, canvas.width, canvas.height);
    saveState();
  };

  const downloadImage = (): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const submitDrawing = async (): Promise<void> => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      const formData = new FormData();
      formData.append('drawing', blob, 'answer.png');
      formData.append('answer_id', '123');

      try {
        const response = await fetch('/api/submit-drawing', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          alert('Drawing submitted successfully!');
        }
      } catch (error) {
        console.error('Error submitting drawing:', error);
      }
    }, 'image/png');
  };

  const colors: string[] = ['#000000', '#FF0000', '#0000FF', '#00FF00', '#FFFF00', '#FF00FF'];

  return (
    <Box className="rounded-md py-3 px-4" sx={{
      border: (theme) => `1px solid ${theme.palette.separator.dark}`
    }}>
      <Typography variant='caption' color='text.middle' className='mb-4! block!'>
        Answer
      </Typography>

      {/* Image selector - only show if images are provided */}
      {images.length > 1 && (
        <div className="mb-4">
          <Typography variant='caption' color='text.middle' className='mb-2 block'>
            Select Image:
          </Typography>
          <div className="flex gap-2 flex-wrap">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setSelectedImageIndex(index)}
                className={`px-3 py-1 rounded text-sm ${selectedImageIndex === index
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
                  }`}
              >
                Image {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="mb-4 p-4 bg-gray-100 rounded-lg flex flex-wrap gap-4 items-center">
        {/* Tools */}
        <div className="flex gap-2">
          <button
            onClick={() => setTool('pen')}
            className={`p-2 rounded ${tool === 'pen' ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-200'}`}
            title="Pen"
          >
            <Brush2 size={20} />
          </button>
          <button
            onClick={() => setTool('eraser')}
            className={`p-2 rounded ${tool === 'eraser' ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-200'}`}
            title="Eraser"
          >
            <Eraser size={20} />
          </button>
        </div>

        {/* Colors */}
        <div className="flex gap-2">
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-8 h-8 rounded border-2 ${color === c ? 'border-blue-500' : 'border-gray-300'}`}
              style={{ backgroundColor: c }}
              title={c}
              aria-label={`Select color ${c}`}
            />
          ))}
        </div>

        {/* Line Width */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Size:</label>
          <input
            type="range"
            min="1"
            max="20"
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
            className="w-24"
          />
          <span className="text-sm text-gray-600">{lineWidth}px</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 ml-auto">
          <button
            onClick={undo}
            disabled={historyStep <= 0}
            className="p-2 rounded bg-white hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Undo"
          >
            <Undo sx={{ fontSize: 20 }} />
          </button>
          <button
            onClick={redo}
            disabled={historyStep >= history.length - 1}
            className="p-2 rounded bg-white hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Redo"
          >
            <Redo sx={{ fontSize: 20 }} />
          </button>
          <button
            onClick={clearCanvas}
            className="p-2 rounded bg-white hover:bg-gray-200 flex items-center gap-1"
            title="Clear"
          >
            <Trash size={20} />
            <Typography variant='subtitle2' color='text.secondary'>
              Clear All
            </Typography>
          </button>
        </div>
      </div>

      {/* Canvas with background image */}
      <div
        className="rounded-lg overflow-hidden relative"
        style={{
          backgroundImage: images.length > 0 ? `url(${images[selectedImageIndex].url})` : 'none',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#ffffff'
        }}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="w-full cursor-crosshair"
          style={{ touchAction: 'none', background: 'transparent' }}
        />
      </div>
    </Box>
  );
};

export default DrawingCanvas;