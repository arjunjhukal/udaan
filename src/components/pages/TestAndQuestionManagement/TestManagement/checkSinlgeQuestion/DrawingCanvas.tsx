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
  value?: Record<number, string>;
  onChange?: (drawings: Record<number, string>) => void;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  images = [],
  value = {},
  onChange
}) => {
  /* -------------------- Refs -------------------- */
  const canvasRefs = useRef<Record<number, HTMLCanvasElement | null>>({});
  const ctxRefs = useRef<Record<number, CanvasRenderingContext2D | null>>({});
  const historyRefs = useRef<Record<number, string[]>>({});
  const historyStepRefs = useRef<Record<number, number>>({});

  /* -------------------- State -------------------- */
  const [tool, setTool] = useState<Tool>('pen');
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(3);
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeImageId, setActiveImageId] = useState<number | null>(null);
  const [drawings, setDrawings] = useState<Record<number, string>>(value);

  const colors = ['#000000', '#FF0000', '#0000FF', '#00FF00', '#FFFF00', '#FF00FF'];

  /* -------------------- Init Canvas -------------------- */
  useEffect(() => {
    images.forEach((img) => {
      const canvas = canvasRefs.current[img.id];
      if (!canvas) return;

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      canvas.width = canvas.offsetWidth;
      canvas.height = 400;

      ctxRefs.current[img.id] = ctx;
      historyRefs.current[img.id] = [];
      historyStepRefs.current[img.id] = -1;

      if (drawings[img.id]) {
        restoreCanvas(drawings[img.id], ctx, canvas);
        saveState(img.id);
      } else {
        saveState(img.id);
      }
    });
  }, [images]);

  /* -------------------- Drawing -------------------- */
  const startDrawing = (
    e: MouseEvent<HTMLCanvasElement>,
    imageId: number
  ) => {
    const canvas = canvasRefs.current[imageId];
    const ctx = ctxRefs.current[imageId];
    if (!canvas || !ctx) return;

    setActiveImageId(imageId);

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = color;
    ctx.lineWidth = tool === 'eraser' ? lineWidth * 3 : lineWidth;
    ctx.globalCompositeOperation =
      tool === 'eraser' ? 'destination-out' : 'source-over';

    setIsDrawing(true);
  };

  const draw = (
    e: MouseEvent<HTMLCanvasElement>,
    imageId: number
  ) => {
    if (!isDrawing || activeImageId !== imageId) return;

    const canvas = canvasRefs.current[imageId];
    const ctx = ctxRefs.current[imageId];
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = (imageId: number) => {
    if (!isDrawing) return;

    const canvas = canvasRefs.current[imageId];
    const ctx = ctxRefs.current[imageId];
    if (!canvas || !ctx) return;

    ctx.closePath();
    setIsDrawing(false);

    saveState(imageId);

    const data = canvas.toDataURL('image/png');
    const updated = { ...drawings, [imageId]: data };
    setDrawings(updated);
    onChange?.(updated);
  };

  /* -------------------- History -------------------- */
  const saveState = (imageId: number) => {
    const canvas = canvasRefs.current[imageId];
    if (!canvas) return;

    const history = historyRefs.current[imageId] || [];
    const step = historyStepRefs.current[imageId] ?? -1;

    const data = canvas.toDataURL('image/png');
    const next = history.slice(0, step + 1);
    next.push(data);

    historyRefs.current[imageId] = next;
    historyStepRefs.current[imageId] = next.length - 1;
  };

  const undo = () => {
    if (!activeImageId) return;

    const step = historyStepRefs.current[activeImageId];
    if (step <= 0) return;

    historyStepRefs.current[activeImageId] = step - 1;
    restoreFromHistory(activeImageId);
  };

  const redo = () => {
    if (!activeImageId) return;

    const history = historyRefs.current[activeImageId];
    const step = historyStepRefs.current[activeImageId];

    if (step >= history.length - 1) return;

    historyStepRefs.current[activeImageId] = step + 1;
    restoreFromHistory(activeImageId);
  };

  const restoreFromHistory = (imageId: number) => {
    const canvas = canvasRefs.current[imageId];
    const ctx = ctxRefs.current[imageId];
    if (!canvas || !ctx) return;

    const step = historyStepRefs.current[imageId];
    const data = historyRefs.current[imageId][step];
    restoreCanvas(data, ctx, canvas);
  };

  /* -------------------- Clear -------------------- */
  const clearCanvas = () => {
    if (!activeImageId) return;

    const canvas = canvasRefs.current[activeImageId];
    const ctx = ctxRefs.current[activeImageId];
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveState(activeImageId);

    const updated = { ...drawings };
    delete updated[activeImageId];
    setDrawings(updated);
    onChange?.(updated);
  };

  /* -------------------- Utils -------------------- */
  const restoreCanvas = (
    dataUrl: string,
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  };

  /* -------------------- Render -------------------- */
  return (
    <Box
      className="rounded-md py-3 px-4"
      sx={{ border: (t) => `1px solid ${t.palette.separator.dark}` }}
    >
      <Typography variant="caption" color='text.middle' className="mb-4! block">
        Answer
      </Typography>

      {/* ===== Global Toolbar (UNCHANGED UX) ===== */}
      <div className="mb-4 p-4 bg-gray-100 rounded-lg flex flex-wrap gap-4 items-center">
        <div className="flex gap-2">
          <button
            onClick={() => setTool('pen')}
            className={`p-2 rounded ${tool === 'pen' ? 'bg-blue-500 text-white' : 'bg-white'}`}
          >
            <Brush2 size={20} />
          </button>
          <button
            onClick={() => setTool('eraser')}
            className={`p-2 rounded ${tool === 'eraser' ? 'bg-blue-500 text-white' : 'bg-white'}`}
          >
            <Eraser size={20} />
          </button>
        </div>

        <div className="flex gap-2">
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-8 h-8 rounded border-2 ${color === c ? 'border-blue-500' : 'border-gray-300'
                }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm">Size</span>
          <input
            type="range"
            min={1}
            max={20}
            value={lineWidth}
            onChange={(e) => setLineWidth(+e.target.value)}
          />
          <span className="text-sm">{lineWidth}px</span>
        </div>

        <div className="flex gap-2 ml-auto">
          <button onClick={undo} className="p-2 bg-white rounded">
            <Undo />
          </button>
          <button onClick={redo} className="p-2 bg-white rounded">
            <Redo />
          </button>
          <button onClick={clearCanvas} className="p-2 bg-white rounded flex items-center gap-1">
            <Trash size={18} />
            <Typography variant="subtitle2">Clear All</Typography>
          </button>
        </div>
      </div>

      {/* ===== Canvas Loop ===== */}
      {images.map((img) => (
        <div
          key={img.id}
          className="mb-8 rounded-lg overflow-hidden relative"
          style={{
            backgroundImage: `url(${img.url})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            minHeight: 400,
            backgroundColor: '#fff'
          }}
        >
          <canvas
            ref={(el) => {
              canvasRefs.current[img.id] = el;
            }}
            className="w-full cursor-crosshair"
            style={{ height: 400 }}
            onMouseDown={(e) => startDrawing(e, img.id)}
            onMouseMove={(e) => draw(e, img.id)}
            onMouseUp={() => stopDrawing(img.id)}
            onMouseLeave={() => stopDrawing(img.id)}
          />
        </div>
      ))}
    </Box>
  );
};

export default DrawingCanvas;
