// import { Redo, Undo } from '@mui/icons-material';
// import { Box, Typography } from '@mui/material';
// import { Brush2, Eraser, Trash } from 'iconsax-reactjs';
// import { type MouseEvent, type TouchEvent, useEffect, useRef, useState } from 'react';

// type Tool = 'pen' | 'eraser';

// interface Image {
//   id: number;
//   url: string;
// }

// interface DrawingCanvasProps {
//   images?: Image[];
//   value?: Record<number, string>;
//   onChange?: (drawings: Record<number, string>) => void;
// }

// const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
//   images = [],
//   value = {},
//   onChange
// }) => {
//   /* -------------------- Refs -------------------- */
//   const canvasRefs = useRef<Record<number, HTMLCanvasElement | null>>({});
//   const imageRefs = useRef<Record<number, HTMLImageElement | null>>({});
//   const ctxRefs = useRef<Record<number, CanvasRenderingContext2D | null>>({});
//   const historyRefs = useRef<Record<number, string[]>>({});
//   const historyStepRefs = useRef<Record<number, number>>({});

//   /* -------------------- State -------------------- */
//   const [tool, setTool] = useState<Tool>('pen');
//   const [color, setColor] = useState('#000000');
//   const [lineWidth, setLineWidth] = useState(3);
//   const [isDrawing, setIsDrawing] = useState(false);
//   const [activeImageId, setActiveImageId] = useState<number | null>(null);
//   const [drawings, setDrawings] = useState<Record<number, string>>(value);

//   const colors = ['#000000', '#FF0000', '#0000FF', '#00FF00', '#FFFF00', '#FF00FF'];

//   /* -------------------- Canvas Initialization -------------------- */
//   const initializeCanvas = (imageId: number) => {
//     const canvas = canvasRefs.current[imageId];
//     const imageEl = imageRefs.current[imageId];
//     if (!canvas || !imageEl) return;

//     const ctx = canvas.getContext('2d', { willReadFrequently: true });
//     if (!ctx) return;

//     // Set canvas internal resolution to match image display size
//     const rect = imageEl.getBoundingClientRect();
//     canvas.width = rect.width;
//     canvas.height = rect.height;

//     ctxRefs.current[imageId] = ctx;

//     // Initialize history if not exists
//     if (!historyRefs.current[imageId]) {
//       historyRefs.current[imageId] = [];
//       historyStepRefs.current[imageId] = -1;
//     }

//     // Restore existing drawing or save initial blank state
//     if (drawings[imageId]) {
//       restoreCanvas(drawings[imageId], ctx, canvas);
//     }

//     saveState(imageId);
//   };

//   useEffect(() => {
//     images.forEach((img) => {
//       if (imageRefs.current[img.id]) {
//         initializeCanvas(img.id);
//       }
//     });

//     // Handle window resize
//     const handleResize = () => {
//       images.forEach((img) => {
//         const canvas = canvasRefs.current[img.id];
//         const imageEl = imageRefs.current[img.id];
//         const ctx = ctxRefs.current[img.id];
//         if (!canvas || !imageEl || !ctx) return;

//         // Save current state before resize
//         const currentDrawing = canvas.toDataURL('image/png');

//         // Update canvas dimensions
//         const rect = imageEl.getBoundingClientRect();
//         canvas.width = rect.width;
//         canvas.height = rect.height;

//         // Restore drawing at new dimensions
//         if (currentDrawing) {
//           restoreCanvas(currentDrawing, ctx, canvas);
//         }
//       });
//     };

//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, [images, drawings]);

//   /* -------------------- Coordinate Calculation -------------------- */
//   const getCoordinates = (
//     e: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>,
//     canvas: HTMLCanvasElement
//   ) => {
//     const rect = canvas.getBoundingClientRect();
//     const scaleX = canvas.width / rect.width;
//     const scaleY = canvas.height / rect.height;

//     let clientX: number;
//     let clientY: number;

//     if ('touches' in e) {
//       const touch = e.touches[0] || e.changedTouches[0];
//       if (!touch) return { x: 0, y: 0 };
//       clientX = touch.clientX;
//       clientY = touch.clientY;
//     } else {
//       clientX = e.clientX;
//       clientY = e.clientY;
//     }

//     return {
//       x: (clientX - rect.left) * scaleX,
//       y: (clientY - rect.top) * scaleY
//     };
//   };

//   /* -------------------- Drawing Functions -------------------- */
//   const startDrawing = (
//     e: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>,
//     imageId: number
//   ) => {
//     e.preventDefault();

//     const canvas = canvasRefs.current[imageId];
//     const ctx = ctxRefs.current[imageId];
//     if (!canvas || !ctx) return;

//     setActiveImageId(imageId);
//     setIsDrawing(true);

//     const { x, y } = getCoordinates(e, canvas);

//     ctx.beginPath();
//     ctx.moveTo(x, y);
//     ctx.lineCap = 'round';
//     ctx.lineJoin = 'round';
//     ctx.strokeStyle = color;
//     ctx.lineWidth = tool === 'eraser' ? lineWidth * 3 : lineWidth;
//     ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';

//     // Draw a point in case it's just a click (no movement)
//     ctx.lineTo(x, y);
//     ctx.stroke();
//   };

//   const draw = (
//     e: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>,
//     imageId: number
//   ) => {
//     if (!isDrawing || activeImageId !== imageId) return;

//     e.preventDefault();

//     const canvas = canvasRefs.current[imageId];
//     const ctx = ctxRefs.current[imageId];
//     if (!canvas || !ctx) return;

//     const { x, y } = getCoordinates(e, canvas);
//     ctx.lineTo(x, y);
//     ctx.stroke();
//   };

//   const stopDrawing = (imageId: number) => {
//     if (!isDrawing) return;

//     const ctx = ctxRefs.current[imageId];
//     if (!ctx) return;

//     ctx.closePath();
//     setIsDrawing(false);

//     saveState(imageId);
//     updateDrawings(imageId);
//   };

//   /* -------------------- History Management -------------------- */
//   const saveState = (imageId: number) => {
//     const canvas = canvasRefs.current[imageId];
//     if (!canvas) return;

//     const history = historyRefs.current[imageId] || [];
//     const step = historyStepRefs.current[imageId] ?? -1;

//     const data = canvas.toDataURL('image/png');

//     // Remove any future states if we're not at the end
//     const newHistory = history.slice(0, step + 1);
//     newHistory.push(data);

//     historyRefs.current[imageId] = newHistory;
//     historyStepRefs.current[imageId] = newHistory.length - 1;
//   };

//   const undo = () => {
//     if (!activeImageId) return;

//     const step = historyStepRefs.current[activeImageId];
//     if (step <= 0) return;

//     historyStepRefs.current[activeImageId] = step - 1;
//     restoreFromHistory(activeImageId);
//     updateDrawings(activeImageId);
//   };

//   const redo = () => {
//     if (!activeImageId) return;

//     const history = historyRefs.current[activeImageId];
//     const step = historyStepRefs.current[activeImageId];

//     if (step >= history.length - 1) return;

//     historyStepRefs.current[activeImageId] = step + 1;
//     restoreFromHistory(activeImageId);
//     updateDrawings(activeImageId);
//   };

//   const restoreFromHistory = (imageId: number) => {
//     const canvas = canvasRefs.current[imageId];
//     const ctx = ctxRefs.current[imageId];
//     if (!canvas || !ctx) return;

//     const step = historyStepRefs.current[imageId];
//     const data = historyRefs.current[imageId][step];

//     if (data) {
//       restoreCanvas(data, ctx, canvas);
//     }
//   };

//   /* -------------------- Clear Canvas -------------------- */
//   const clearCanvas = () => {
//     if (!activeImageId) return;

//     const canvas = canvasRefs.current[activeImageId];
//     const ctx = ctxRefs.current[activeImageId];
//     if (!canvas || !ctx) return;

//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     saveState(activeImageId);

//     const updated = { ...drawings };
//     delete updated[activeImageId];
//     setDrawings(updated);
//     onChange?.(updated);
//   };

//   /* -------------------- Utility Functions -------------------- */
//   const restoreCanvas = (
//     dataUrl: string,
//     ctx: CanvasRenderingContext2D,
//     canvas: HTMLCanvasElement
//   ) => {
//     const img = new Image();
//     img.src = dataUrl;
//     img.onload = () => {
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//       ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
//     };
//   };

//   const updateDrawings = (imageId: number) => {
//     const canvas = canvasRefs.current[imageId];
//     if (!canvas) return;

//     const data = canvas.toDataURL('image/png');
//     const updated = { ...drawings, [imageId]: data };
//     setDrawings(updated);
//     onChange?.(updated);
//   };

//   const handleImageLoad = (imageId: number) => {
//     initializeCanvas(imageId);
//   };

//   /* -------------------- Render -------------------- */
//   return (
//     <Box
//       className="rounded-md py-3 px-4"
//       sx={{ border: (t) => `1px solid ${t.palette.separator.dark}` }}
//     >
//       <Typography variant="caption" color="text.middle" className="mb-4! block">
//         Answer
//       </Typography>

//       <Box
//         className="mb-4 p-4 rounded-lg flex flex-wrap gap-4 items-center sticky -top-4 z-10"
//         sx={{
//           background: (theme) => theme.palette.separator.dark
//         }}
//       >
//         {/* Tools */}
//         <div className="flex gap-2">
//           <button
//             onClick={() => setTool('pen')}
//             className={`p-2 rounded transition-colors ${tool === 'pen' ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-200'
//               }`}
//             title="Pen"
//           >
//             <Brush2 size={20} />
//           </button>
//           <button
//             onClick={() => setTool('eraser')}
//             className={`p-2 rounded transition-colors ${tool === 'eraser' ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-200'
//               }`}
//             title="Eraser"
//           >
//             <Eraser size={20} />
//           </button>
//         </div>

//         {/* Colors */}
//         <div className="flex gap-2 flex-wrap">
//           {colors.map((c) => (
//             <button
//               key={c}
//               onClick={() => setColor(c)}
//               className={`w-8 h-8 rounded border-2 transition-all ${color === c ? 'border-blue-500 scale-110' : 'border-gray-300 hover:scale-105'
//                 }`}
//               style={{ backgroundColor: c }}
//               title={c}
//             />
//           ))}
//         </div>

//         {/* Line Width */}
//         <div className="flex items-center gap-2">
//           <span className="text-sm whitespace-nowrap">Size</span>
//           <input
//             type="range"
//             min={1}
//             max={20}
//             value={lineWidth}
//             onChange={(e) => setLineWidth(+e.target.value)}
//             className="w-20"
//           />
//           <span className="text-sm whitespace-nowrap">{lineWidth}px</span>
//         </div>

//         {/* Actions */}
//         <div className="flex gap-2 ml-auto">
//           <button
//             onClick={undo}
//             className="p-2 bg-white rounded hover:bg-gray-200 transition-colors"
//             title="Undo"
//             disabled={!activeImageId || (historyStepRefs.current[activeImageId] ?? 0) <= 0}
//           >
//             <Undo />
//           </button>
//           <button
//             onClick={redo}
//             className="p-2 bg-white rounded hover:bg-gray-200 transition-colors"
//             title="Redo"
//             disabled={
//               !activeImageId ||
//               (historyStepRefs.current[activeImageId] ?? 0) >=
//               ((historyRefs.current[activeImageId]?.length ?? 1) - 1)
//             }
//           >
//             <Redo />
//           </button>
//           <button
//             onClick={clearCanvas}
//             className="p-2 bg-white rounded hover:bg-gray-200 transition-colors flex items-center gap-1"
//             title="Clear current canvas"
//             disabled={!activeImageId}
//           >
//             <Trash size={18} />
//             <Typography variant="subtitle2">Clear</Typography>
//           </button>
//         </div>
//       </Box>

//       {/* ===== Scrollable Canvas Area ===== */}
//       <Box
//         sx={{
//           maxHeight: 'calc(100vh - 350px)',
//           overflow: 'auto',
//           '&::-webkit-scrollbar': {
//             width: '8px',
//           },
//           '&::-webkit-scrollbar-track': {
//             background: '#f1f1f1',
//             borderRadius: '4px',
//           },
//           '&::-webkit-scrollbar-thumb': {
//             background: '#888',
//             borderRadius: '4px',
//           },
//           '&::-webkit-scrollbar-thumb:hover': {
//             background: '#555',
//           },
//         }}
//       >
//         {images.map((img) => (
//           <div
//             key={img.id}
//             className="mb-8 relative"
//             onClick={() => setActiveImageId(img.id)}
//           >
//             {/* Image */}
//             <img
//               ref={(el) => {
//                 imageRefs.current[img.id] = el;
//               }}
//               src={img.url}
//               alt={`Question ${img.id}`}
//               className="w-full block pointer-events-none select-none"
//               onLoad={() => handleImageLoad(img.id)}
//               draggable={false}
//             />

//             {/* Canvas Overlay */}
//             <canvas
//               ref={(el) => {
//                 canvasRefs.current[img.id] = el;
//               }}
//               className="absolute top-0 left-0 w-full h-full"
//               style={{
//                 cursor: tool === 'pen' ? 'crosshair' : 'pointer',
//                 touchAction: 'none',
//               }}
//               onMouseDown={(e) => startDrawing(e, img.id)}
//               onMouseMove={(e) => draw(e, img.id)}
//               onMouseUp={() => stopDrawing(img.id)}
//               onMouseLeave={() => stopDrawing(img.id)}
//               onTouchStart={(e) => startDrawing(e, img.id)}
//               onTouchMove={(e) => draw(e, img.id)}
//               onTouchEnd={() => stopDrawing(img.id)}
//               onTouchCancel={() => stopDrawing(img.id)}
//             />

//             {/* Active Indicator */}
//             {activeImageId === img.id && (
//               <div className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-normal">
//                 Active
//               </div>
//             )}
//           </div>
//         ))}

//         {images.length === 0 && (
//           <div className="text-center py-12 text-gray-400">
//             No images to draw on
//           </div>
//         )}
//       </Box>
//     </Box>
//   );
// };

// export default DrawingCanvas;


import { Redo, Undo } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { Brush2, Eraser, Trash } from 'iconsax-reactjs';
import { type MouseEvent, type TouchEvent, useCallback, useEffect, useRef, useState } from 'react';

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
  const imageRefs = useRef<Record<number, HTMLImageElement | null>>({});
  const ctxRefs = useRef<Record<number, CanvasRenderingContext2D | null>>({});
  const historyRefs = useRef<Record<number, string[]>>({});
  const historyStepRefs = useRef<Record<number, number>>({});
  const initializedRefs = useRef<Record<number, boolean>>({});
  const drawingsRef = useRef<Record<number, string>>(value);

  /* -------------------- State -------------------- */
  const [tool, setTool] = useState<Tool>('pen');
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(3);
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeImageId, setActiveImageId] = useState<number | null>(null);
  const [drawings, setDrawings] = useState<Record<number, string>>(value);
  const [, forceUpdate] = useState(0); // For re-rendering on undo/redo

  const colors = ['#000000', '#FF0000', '#0000FF', '#00FF00', '#FFFF00', '#FF00FF'];

  // Keep drawingsRef in sync
  useEffect(() => {
    drawingsRef.current = drawings;
  }, [drawings]);

  /* -------------------- Utility Functions -------------------- */
  const restoreCanvas = useCallback((
    dataUrl: string,
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ): Promise<void> => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve();
      };
      img.onerror = () => {
        resolve(); // Resolve anyway to not block
      };
      img.src = dataUrl;
    });
  }, []);

  /* -------------------- History Management -------------------- */
  const saveState = useCallback((imageId: number) => {
    const canvas = canvasRefs.current[imageId];
    if (!canvas) return;

    const history = historyRefs.current[imageId] || [];
    const step = historyStepRefs.current[imageId] ?? -1;

    const data = canvas.toDataURL('image/png');

    // Remove any future states if we're not at the end
    const newHistory = history.slice(0, step + 1);
    newHistory.push(data);

    // Limit history to prevent memory issues
    if (newHistory.length > 50) {
      newHistory.shift();
    }

    historyRefs.current[imageId] = newHistory;
    historyStepRefs.current[imageId] = newHistory.length - 1;
  }, []);

  /* -------------------- Canvas Initialization -------------------- */
  const initializeCanvas = useCallback(async (imageId: number) => {
    const canvas = canvasRefs.current[imageId];
    const imageEl = imageRefs.current[imageId];
    if (!canvas || !imageEl) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Set canvas internal resolution to match image display size
    const rect = imageEl.getBoundingClientRect();

    // Only resize if dimensions actually changed
    const needsResize = canvas.width !== rect.width || canvas.height !== rect.height;

    if (needsResize) {
      // Save current drawing before resizing (if canvas already has content)
      let currentDrawing: string | null = null;
      if (initializedRefs.current[imageId] && ctxRefs.current[imageId]) {
        currentDrawing = canvas.toDataURL('image/png');
      }

      canvas.width = rect.width;
      canvas.height = rect.height;

      // Restore the drawing after resize
      if (currentDrawing) {
        await restoreCanvas(currentDrawing, ctx, canvas);
      }
    }

    ctxRefs.current[imageId] = ctx;

    // Initialize history and restore drawing only on first initialization
    if (!initializedRefs.current[imageId]) {
      historyRefs.current[imageId] = [];
      historyStepRefs.current[imageId] = -1;

      // Restore existing drawing if available
      const existingDrawing = drawingsRef.current[imageId];
      if (existingDrawing) {
        await restoreCanvas(existingDrawing, ctx, canvas);
      }

      // Save initial state AFTER restoring
      saveState(imageId);
      initializedRefs.current[imageId] = true;
    }
  }, [restoreCanvas, saveState]);

  useEffect(() => {
    images.forEach((img) => {
      if (imageRefs.current[img.id]) {
        initializeCanvas(img.id);
      }
    });

    // Handle window resize
    const handleResize = () => {
      images.forEach((img) => {
        initializeCanvas(img.id);
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [images, initializeCanvas]); // Removed 'drawings' from dependencies

  /* -------------------- Coordinate Calculation -------------------- */
  const getCoordinates = (
    e: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>,
    canvas: HTMLCanvasElement
  ) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX: number;
    let clientY: number;

    if ('touches' in e) {
      const touch = e.touches[0] || e.changedTouches[0];
      if (!touch) return { x: 0, y: 0 };
      clientX = touch.clientX;
      clientY = touch.clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  /* -------------------- Drawing Functions -------------------- */
  const startDrawing = (
    e: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>,
    imageId: number
  ) => {
    e.preventDefault();

    const canvas = canvasRefs.current[imageId];
    const ctx = ctxRefs.current[imageId];
    if (!canvas || !ctx) return;

    setActiveImageId(imageId);
    setIsDrawing(true);

    const { x, y } = getCoordinates(e, canvas);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = color;
    ctx.lineWidth = tool === 'eraser' ? lineWidth * 3 : lineWidth;
    ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';

    // Draw a point in case it's just a click (no movement)
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const draw = (
    e: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>,
    imageId: number
  ) => {
    if (!isDrawing || activeImageId !== imageId) return;

    e.preventDefault();

    const canvas = canvasRefs.current[imageId];
    const ctx = ctxRefs.current[imageId];
    if (!canvas || !ctx) return;

    const { x, y } = getCoordinates(e, canvas);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = (imageId: number) => {
    if (!isDrawing) return;

    const ctx = ctxRefs.current[imageId];
    if (!ctx) return;

    ctx.closePath();
    setIsDrawing(false);

    saveState(imageId);
    updateDrawings(imageId);
  };

  const undo = async () => {
    if (activeImageId === null) return;

    const step = historyStepRefs.current[activeImageId];
    if (step === undefined || step <= 0) return;

    const canvas = canvasRefs.current[activeImageId];
    const ctx = ctxRefs.current[activeImageId];
    if (!canvas || !ctx) return;

    historyStepRefs.current[activeImageId] = step - 1;
    const newStep = step - 1;
    const data = historyRefs.current[activeImageId][newStep];

    if (data) {
      await restoreCanvas(data, ctx, canvas);
      updateDrawings(activeImageId);
      forceUpdate(n => n + 1); // Force re-render to update button states
    }
  };

  const redo = async () => {
    if (activeImageId === null) return;

    const history = historyRefs.current[activeImageId];
    const step = historyStepRefs.current[activeImageId];

    if (!history || step === undefined || step >= history.length - 1) return;

    const canvas = canvasRefs.current[activeImageId];
    const ctx = ctxRefs.current[activeImageId];
    if (!canvas || !ctx) return;

    historyStepRefs.current[activeImageId] = step + 1;
    const newStep = step + 1;
    const data = history[newStep];

    if (data) {
      await restoreCanvas(data, ctx, canvas);
      updateDrawings(activeImageId);
      forceUpdate(n => n + 1); // Force re-render to update button states
    }
  };

  /* -------------------- Clear Canvas -------------------- */
  const clearCanvas = () => {
    if (activeImageId === null) return;

    const canvas = canvasRefs.current[activeImageId];
    const ctx = ctxRefs.current[activeImageId];
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveState(activeImageId);

    const updated = { ...drawings };
    delete updated[activeImageId];
    setDrawings(updated);
    onChange?.(updated);
    forceUpdate(n => n + 1);
  };

  const updateDrawings = (imageId: number) => {
    const canvas = canvasRefs.current[imageId];
    if (!canvas) return;

    const data = canvas.toDataURL('image/png');
    const updated = { ...drawingsRef.current, [imageId]: data };
    setDrawings(updated);
    onChange?.(updated);
  };

  const handleImageLoad = (imageId: number) => {
    initializeCanvas(imageId);
  };

  /* -------------------- Render -------------------- */
  return (
    <Box
      className="rounded-md py-3 px-4"
      sx={{ border: (t) => `1px solid ${t.palette.separator.dark}` }}
    >
      <Typography variant="caption" color="text.middle" className="mb-4! block">
        Answer
      </Typography>

      <Box
        className="mb-4 p-4 rounded-lg flex flex-wrap gap-4 items-center sticky -top-4 z-10"
        sx={{
          background: (theme) => theme.palette.separator.dark
        }}
      >
        {/* Tools */}
        <div className="flex gap-2">
          <button
            onClick={() => setTool('pen')}
            className={`p-2 rounded transition-colors ${tool === 'pen' ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-200'
              }`}
            title="Pen"
          >
            <Brush2 size={20} />
          </button>
          <button
            onClick={() => setTool('eraser')}
            className={`p-2 rounded transition-colors ${tool === 'eraser' ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-200'
              }`}
            title="Eraser"
          >
            <Eraser size={20} />
          </button>
        </div>

        {/* Colors */}
        <div className="flex gap-2 flex-wrap">
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-8 h-8 rounded border-2 transition-all ${color === c ? 'border-blue-500 scale-110' : 'border-gray-300 hover:scale-105'
                }`}
              style={{ backgroundColor: c }}
              title={c}
            />
          ))}
        </div>

        {/* Line Width */}
        <div className="flex items-center gap-2">
          <span className="text-sm whitespace-nowrap">Size</span>
          <input
            type="range"
            min={1}
            max={20}
            value={lineWidth}
            onChange={(e) => setLineWidth(+e.target.value)}
            className="w-20"
          />
          <span className="text-sm whitespace-nowrap">{lineWidth}px</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 ml-auto">
          <Button
            sx={{
              background: (theme) => theme.palette.separator.darkest
            }}
            onClick={undo}
            className="p-2  rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Undo"
            disabled={activeImageId === null || (historyStepRefs.current[activeImageId] ?? 0) <= 0}
          >
            <Undo />
          </Button>
          <Button
            sx={{
              background: (theme) => theme.palette.separator.darkest
            }}
            onClick={redo}
            className="p-2  rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Redo"
            disabled={
              activeImageId === null ||
              (historyStepRefs.current[activeImageId] ?? 0) >=
              ((historyRefs.current[activeImageId]?.length ?? 1) - 1)
            }
          >
            <Redo />
          </Button>
          <Button
            sx={{
              background: (theme) => theme.palette.separator.darkest
            }}
            onClick={clearCanvas}
            className="p-2 rounded hover:bg-gray-200 transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Clear current canvas"
            disabled={activeImageId === null}
          >
            <Trash size={18} />
            <Typography variant="subtitle2">Clear</Typography>
          </Button>
        </div>
      </Box>

      {/* ===== Scrollable Canvas Area ===== */}
      <Box
        sx={{
          maxHeight: 'calc(100vh - 350px)',
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#555',
          },
        }}
      >
        {images.map((img) => (
          <div
            key={img.id}
            className="mb-8 relative"
            onClick={() => setActiveImageId(img.id)}
          >
            {/* Image */}
            <img
              ref={(el) => {
                imageRefs.current[img.id] = el;
              }}
              src={img.url}
              alt={`Question ${img.id}`}
              className="w-full block pointer-events-none select-none"
              onLoad={() => handleImageLoad(img.id)}
              draggable={false}
            />

            {/* Canvas Overlay */}
            <canvas
              ref={(el) => {
                canvasRefs.current[img.id] = el;
              }}
              className="absolute top-0 left-0 w-full h-full"
              style={{
                cursor: tool === 'pen' ? 'crosshair' : 'pointer',
                touchAction: 'none',
              }}
              onMouseDown={(e) => startDrawing(e, img.id)}
              onMouseMove={(e) => draw(e, img.id)}
              onMouseUp={() => stopDrawing(img.id)}
              onMouseLeave={() => stopDrawing(img.id)}
              onTouchStart={(e) => startDrawing(e, img.id)}
              onTouchMove={(e) => draw(e, img.id)}
              onTouchEnd={() => stopDrawing(img.id)}
              onTouchCancel={() => stopDrawing(img.id)}
            />

            {/* Active Indicator */}
            {activeImageId === img.id && (
              <div className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-normal">
                Active
              </div>
            )}
          </div>
        ))}

        {images.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No images to draw on
          </div>
        )}
      </Box>
    </Box>
  );
};

export default DrawingCanvas;
