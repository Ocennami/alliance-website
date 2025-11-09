"use client";

import {
  useRef,
  useState,
  useEffect,
  MouseEvent,
  useCallback,
  useMemo,
} from "react";
import { motion } from "framer-motion";
import {
  FiEdit3,
  FiSquare,
  FiCircle,
  FiMinus,
  FiType,
  FiMove,
  FiRotateCcw,
  FiRotateCw,
  FiArrowRight,
  FiMousePointer,
  FiGrid,
  FiUsers,
} from "react-icons/fi";
import { supabase } from "@/lib/supabase";
import { useSession } from "next-auth/react";

// Custom Eraser Icon
const EraserIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M7 21h10" />
    <path d="M20 8L8 20l-5-5L15 3l5 5z" />
    <path d="M8 20L3 15" />
  </svg>
);

type Tool =
  | "select"
  | "pen"
  | "eraser"
  | "line"
  | "rectangle"
  | "circle"
  | "arrow"
  | "text"
  | "pan";

interface Point {
  x: number;
  y: number;
}

interface DrawElement {
  id: string;
  type: Tool;
  points?: Point[];
  startPoint?: Point;
  endPoint?: Point;
  text?: string;
  color: string;
  lineWidth: number;
  userId?: string;
  strokeStyle?: "solid" | "dashed" | "dotted";
  opacity?: number;
}

export default function FreeDrawCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const elementIdRef = useRef(0);
  const { data: session } = useSession();

  // Initialize anonymous ID once on mount
  const [anonymousId] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("canvas-user-id");
      if (stored && !stored.includes("@")) {
        return stored;
      }
    }
    return `anonymous-${Math.random().toString(36).substring(7)}`;
  });

  // Use authenticated user ID if logged in, otherwise use anonymous ID
  const userId = useMemo(() => {
    if (session?.user?.email) {
      // User logged in - use their email as userId
      if (typeof window !== "undefined") {
        localStorage.setItem("canvas-user-id", session.user.email);
      }
      return session.user.email;
    } else {
      // User not logged in - use anonymous ID
      if (typeof window !== "undefined") {
        localStorage.setItem("canvas-user-id", anonymousId);
      }
      return anonymousId;
    }
  }, [session?.user?.email, anonymousId]);

  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<Tool>("pen");
  const [color, setColor] = useState("#8B5CF6");
  const [brushSize, setBrushSize] = useState(3);
  const [elements, setElements] = useState<DrawElement[]>([]);
  const [currentElement, setCurrentElement] = useState<DrawElement | null>(
    null
  );
  const [history, setHistory] = useState<DrawElement[][]>([[]]);
  const [historyStep, setHistoryStep] = useState(0);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState<Point | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [strokeStyle, setStrokeStyle] = useState<"solid" | "dashed" | "dotted">(
    "solid"
  );
  const [opacity, setOpacity] = useState(100);
  const [cursorPos, setCursorPos] = useState<Point | null>(null);
  const [isShiftPressed, setIsShiftPressed] = useState(false);
  const [lastTouchDistance, setLastTouchDistance] = useState<number | null>(
    null
  );

  const colors = [
    { name: "Purple", value: "#8B5CF6" },
    { name: "Pink", value: "#EC4899" },
    { name: "Blue", value: "#3B82F6" },
    { name: "Green", value: "#10B981" },
    { name: "Yellow", value: "#F59E0B" },
    { name: "Red", value: "#EF4444" },
    { name: "Black", value: "#000000" },
    { name: "Gray", value: "#6B7280" },
  ];

  const tools = [
    { id: "select" as Tool, icon: FiMousePointer, label: "Select", key: "1" },
    { id: "pen" as Tool, icon: FiEdit3, label: "Pen", key: "2" },
    { id: "eraser" as Tool, icon: EraserIcon, label: "Eraser", key: "3" },
    { id: "line" as Tool, icon: FiMinus, label: "Line", key: "4" },
    { id: "arrow" as Tool, icon: FiArrowRight, label: "Arrow", key: "7" },
    { id: "rectangle" as Tool, icon: FiSquare, label: "Rectangle", key: "5" },
    { id: "circle" as Tool, icon: FiCircle, label: "Circle", key: "6" },
    { id: "text" as Tool, icon: FiType, label: "Text", key: "8" },
    { id: "pan" as Tool, icon: FiMove, label: "Pan", key: "Space" },
  ];

  // Draw element function
  const drawElement = useCallback(
    (ctx: CanvasRenderingContext2D, element: DrawElement) => {
      // Apply opacity
      const alpha = (element.opacity ?? 100) / 100;
      const colorWithAlpha =
        element.color +
        Math.floor(alpha * 255)
          .toString(16)
          .padStart(2, "0");

      ctx.strokeStyle = colorWithAlpha;
      ctx.fillStyle = colorWithAlpha;
      ctx.lineWidth = element.lineWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Apply stroke style
      if (element.strokeStyle === "dashed") {
        ctx.setLineDash([10, 5]);
      } else if (element.strokeStyle === "dotted") {
        ctx.setLineDash([2, 5]);
      } else {
        ctx.setLineDash([]);
      }

      switch (element.type) {
        case "pen":
          if (element.points && element.points.length > 1) {
            ctx.beginPath();
            ctx.moveTo(element.points[0].x, element.points[0].y);
            for (let i = 1; i < element.points.length; i++) {
              ctx.lineTo(element.points[i].x, element.points[i].y);
            }
            ctx.stroke();
          }
          break;
        case "line":
          if (element.startPoint && element.endPoint) {
            ctx.beginPath();
            ctx.moveTo(element.startPoint.x, element.startPoint.y);
            ctx.lineTo(element.endPoint.x, element.endPoint.y);
            ctx.stroke();
          }
          break;
        case "arrow":
          if (element.startPoint && element.endPoint) {
            const headLength = 15;
            const angle = Math.atan2(
              element.endPoint.y - element.startPoint.y,
              element.endPoint.x - element.startPoint.x
            );
            ctx.beginPath();
            ctx.moveTo(element.startPoint.x, element.startPoint.y);
            ctx.lineTo(element.endPoint.x, element.endPoint.y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(element.endPoint.x, element.endPoint.y);
            ctx.lineTo(
              element.endPoint.x - headLength * Math.cos(angle - Math.PI / 6),
              element.endPoint.y - headLength * Math.sin(angle - Math.PI / 6)
            );
            ctx.moveTo(element.endPoint.x, element.endPoint.y);
            ctx.lineTo(
              element.endPoint.x - headLength * Math.cos(angle + Math.PI / 6),
              element.endPoint.y - headLength * Math.sin(angle + Math.PI / 6)
            );
            ctx.stroke();
          }
          break;
        case "rectangle":
          if (element.startPoint && element.endPoint) {
            const width = element.endPoint.x - element.startPoint.x;
            const height = element.endPoint.y - element.startPoint.y;
            ctx.strokeRect(
              element.startPoint.x,
              element.startPoint.y,
              width,
              height
            );
          }
          break;
        case "circle":
          if (element.startPoint && element.endPoint) {
            const radius = Math.sqrt(
              Math.pow(element.endPoint.x - element.startPoint.x, 2) +
                Math.pow(element.endPoint.y - element.startPoint.y, 2)
            );
            ctx.beginPath();
            ctx.arc(
              element.startPoint.x,
              element.startPoint.y,
              radius,
              0,
              Math.PI * 2
            );
            ctx.stroke();
          }
          break;
        case "text":
          if (element.startPoint && element.text) {
            ctx.font = `${element.lineWidth * 8}px Arial`;
            ctx.fillText(
              element.text,
              element.startPoint.x,
              element.startPoint.y
            );
          }
          break;
      }
    },
    []
  );

  // Redraw canvas
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear with white background
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Apply transformations for all drawings including grid
    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(scale, scale);

    // Draw grid if enabled (after transformations so it scales)
    if (showGrid) {
      ctx.save();
      ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
      ctx.lineWidth = 1 / scale; // Adjust line width based on scale

      const gridSize = 20;
      const startX = Math.floor(-offset.x / scale / gridSize) * gridSize;
      const startY = Math.floor(-offset.y / scale / gridSize) * gridSize;
      const endX =
        Math.ceil((canvas.width - offset.x) / scale / gridSize) * gridSize;
      const endY =
        Math.ceil((canvas.height - offset.y) / scale / gridSize) * gridSize;

      // Vertical lines
      for (let x = startX; x <= endX; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, startY);
        ctx.lineTo(x, endY);
        ctx.stroke();
      }
      // Horizontal lines
      for (let y = startY; y <= endY; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(startX, y);
        ctx.lineTo(endX, y);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Draw elements
    elements.forEach((element) => drawElement(ctx, element));
    if (currentElement) drawElement(ctx, currentElement);
    ctx.restore();

    // Draw cursor preview (outside transformations)
    if (cursorPos && (tool === "pen" || tool === "eraser")) {
      ctx.save();
      ctx.strokeStyle = tool === "eraser" ? "#EF4444" : color;
      ctx.fillStyle =
        tool === "eraser"
          ? "rgba(239, 68, 68, 0.1)"
          : "rgba(139, 92, 246, 0.1)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cursorPos.x, cursorPos.y, brushSize * scale, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fill();
      ctx.restore();
    }
  }, [
    elements,
    currentElement,
    scale,
    offset,
    drawElement,
    showGrid,
    cursorPos,
    tool,
    brushSize,
    color,
  ]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Track Shift key
      if (e.shiftKey) setIsShiftPressed(true);

      // Tool shortcuts (numbers)
      if (e.key === "1") setTool("select");
      if (e.key === "2") setTool("pen");
      if (e.key === "3") setTool("eraser");
      if (e.key === "4") setTool("line");
      if (e.key === "5") setTool("rectangle");
      if (e.key === "6") setTool("circle");
      if (e.key === "7") setTool("arrow");
      if (e.key === "8") setTool("text");

      // Brush size shortcuts
      if (e.key === "[" && brushSize > 1) setBrushSize(brushSize - 1);
      if (e.key === "]" && brushSize < 20) setBrushSize(brushSize + 1);

      // Grid toggle
      if (e.key === "g" || e.key === "G") setShowGrid(!showGrid);

      // Pan with Space
      if (e.code === "Space" && !isPanning) {
        setTool("pan");
        e.preventDefault();
      }

      // Undo/Redo
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        if (historyStep > 0) {
          setHistoryStep(historyStep - 1);
          setElements(history[historyStep - 1]);
        }
      }
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "y" || (e.key === "z" && e.shiftKey))
      ) {
        e.preventDefault();
        if (historyStep < history.length - 1) {
          setHistoryStep(historyStep + 1);
          setElements(history[historyStep + 1]);
        }
      }

      // Delete selected (future feature)
      if (e.key === "Delete" || e.key === "Backspace") {
        // Will implement when select tool is ready
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setTool("pen"); // Return to pen after releasing space
      }
      if (e.key === "Shift") {
        setIsShiftPressed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [brushSize, showGrid, isPanning, historyStep, history]);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      redrawCanvas();
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [redrawCanvas]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  // Real-time collaborative drawing with Supabase
  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const setupRealtimeSync = async () => {
      // Load existing elements from database
      const { data, error } = await supabase
        .from("drawing_elements")
        .select("*")
        .order("created_at", { ascending: true });

      if (!error && data) {
        const loadedElements: DrawElement[] = data.map((item) => ({
          id: item.element_id,
          type: item.type as Tool,
          points: item.points,
          startPoint: item.start_point,
          endPoint: item.end_point,
          text: item.text,
          color: item.color,
          lineWidth: item.line_width,
          userId: item.user_id,
          strokeStyle: item.stroke_style || "solid",
          opacity: item.opacity || 100,
        }));
        setElements(loadedElements);
        setHistory([loadedElements]);
        setHistoryStep(0);
        setIsConnected(true);
      }

      // Subscribe to real-time changes
      channel = supabase
        .channel("drawing-collaboration")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "drawing_elements",
          },
          (payload) => {
            const newElement: DrawElement = {
              id: payload.new.element_id,
              type: payload.new.type as Tool,
              points: payload.new.points,
              startPoint: payload.new.start_point,
              endPoint: payload.new.end_point,
              text: payload.new.text,
              color: payload.new.color,
              lineWidth: payload.new.line_width,
              userId: payload.new.user_id,
              strokeStyle: payload.new.stroke_style || "solid",
              opacity: payload.new.opacity || 100,
            };

            setElements((prev) => {
              // Avoid duplicates
              if (prev.some((el) => el.id === newElement.id)) return prev;
              return [...prev, newElement];
            });
          }
        )
        .on(
          "postgres_changes",
          {
            event: "DELETE",
            schema: "public",
            table: "drawing_elements",
          },
          () => {
            // Reload all elements when cleared
            supabase
              .from("drawing_elements")
              .select("*")
              .order("created_at", { ascending: true })
              .then(({ data }) => {
                if (data) {
                  const loadedElements: DrawElement[] = data.map((item) => ({
                    id: item.element_id,
                    type: item.type as Tool,
                    points: item.points,
                    startPoint: item.start_point,
                    endPoint: item.end_point,
                    text: item.text,
                    color: item.color,
                    lineWidth: item.line_width,
                    userId: item.user_id,
                    strokeStyle: item.stroke_style || "solid",
                    opacity: item.opacity || 100,
                  }));
                  setElements(loadedElements);
                }
              });
          }
        )
        .subscribe((status) => {
          if (status === "SUBSCRIBED") {
            setIsConnected(true);
            setOnlineUsers(1); // At least this user is online
          }
        });

      // Track presence for online users count
      if (channel) {
        channel
          .on("presence", { event: "sync" }, () => {
            if (channel) {
              const presenceState = channel.presenceState();
              const userCount = Object.keys(presenceState).length;
              setOnlineUsers(userCount > 0 ? userCount : 1);
            }
          })
          .subscribe();

        // Track this user's presence
        const userId = `user-${Math.random().toString(36).substring(7)}`;
        channel.track({ user_id: userId, online_at: new Date().toISOString() });
      }
    };

    setupRealtimeSync();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
      setIsConnected(false);
    };
  }, []);

  // Mouse handlers
  const getMousePos = (e: MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left - offset.x) / scale,
      y: (e.clientY - rect.top - offset.y) / scale,
    };
  };

  const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    if (tool === "pan") {
      setIsPanning(true);
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        setLastPanPoint({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }
      return;
    }

    const point = getMousePos(e);

    // Eraser: Remove element at click position (only user's own drawings)
    if (tool === "eraser") {
      const threshold = 10; // Click tolerance in pixels

      const elementToRemove = elements.find((element) => {
        // Only allow erasing own drawings or legacy drawings without userId
        // Skip if element has a userId but it doesn't match current user
        if (element.userId && element.userId !== userId) return false;

        if (element.type === "pen" && element.points) {
          // Check if point is near any point in the pen stroke
          return element.points.some(
            (p) =>
              Math.abs(p.x - point.x) < threshold &&
              Math.abs(p.y - point.y) < threshold
          );
        } else if (element.startPoint && element.endPoint) {
          const start = element.startPoint;
          const end = element.endPoint;

          if (element.type === "line" || element.type === "arrow") {
            // Check distance from point to line segment
            const dx = end.x - start.x;
            const dy = end.y - start.y;
            const lengthSquared = dx * dx + dy * dy;

            if (lengthSquared === 0) {
              // Start and end are the same point
              const dist = Math.sqrt(
                Math.pow(point.x - start.x, 2) + Math.pow(point.y - start.y, 2)
              );
              return dist < threshold;
            }

            const t = Math.max(
              0,
              Math.min(
                1,
                ((point.x - start.x) * dx + (point.y - start.y) * dy) /
                  lengthSquared
              )
            );
            const projX = start.x + t * dx;
            const projY = start.y + t * dy;
            const dist = Math.sqrt(
              Math.pow(point.x - projX, 2) + Math.pow(point.y - projY, 2)
            );
            return dist < threshold;
          } else if (element.type === "circle") {
            // Check if point is near the circle's edge
            const radius = Math.sqrt(
              Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
            );
            const distFromCenter = Math.sqrt(
              Math.pow(point.x - start.x, 2) + Math.pow(point.y - start.y, 2)
            );
            return Math.abs(distFromCenter - radius) < threshold;
          } else if (element.type === "rectangle") {
            // Check if point is near any of the rectangle's edges
            const minX = Math.min(start.x, end.x);
            const maxX = Math.max(start.x, end.x);
            const minY = Math.min(start.y, end.y);
            const maxY = Math.max(start.y, end.y);

            // Check distance to each edge
            const distToLeft = Math.abs(point.x - minX);
            const distToRight = Math.abs(point.x - maxX);
            const distToTop = Math.abs(point.y - minY);
            const distToBottom = Math.abs(point.y - maxY);

            // Point is near an edge if it's close to one side and within the bounds of the other dimension
            const nearLeftEdge =
              distToLeft < threshold &&
              point.y >= minY - threshold &&
              point.y <= maxY + threshold;
            const nearRightEdge =
              distToRight < threshold &&
              point.y >= minY - threshold &&
              point.y <= maxY + threshold;
            const nearTopEdge =
              distToTop < threshold &&
              point.x >= minX - threshold &&
              point.x <= maxX + threshold;
            const nearBottomEdge =
              distToBottom < threshold &&
              point.x >= minX - threshold &&
              point.x <= maxX + threshold;

            return (
              nearLeftEdge || nearRightEdge || nearTopEdge || nearBottomEdge
            );
          }
        }
        return false;
      });

      if (elementToRemove) {
        const newElements = elements.filter(
          (el) => el.id !== elementToRemove.id
        );
        setElements(newElements);
        const newHistory = history.slice(0, historyStep + 1);
        newHistory.push(newElements);
        setHistory(newHistory);
        setHistoryStep(newHistory.length - 1);

        // Delete from Supabase
        supabase
          .from("drawing_elements")
          .delete()
          .eq("element_id", elementToRemove.id)
          .then();
      }
      return;
    }

    setIsDrawing(true);

    if (tool === "text") {
      const text = prompt("Enter text:");
      if (text) {
        const newElement: DrawElement = {
          id: `element-${++elementIdRef.current}`,
          type: "text",
          startPoint: point,
          text,
          color,
          lineWidth: brushSize,
          userId,
          strokeStyle,
          opacity,
        };
        const newElements = [...elements, newElement];
        setElements(newElements);
        const newHistory = history.slice(0, historyStep + 1);
        newHistory.push(newElements);
        setHistory(newHistory);
        setHistoryStep(newHistory.length - 1);
      }
      return;
    }

    const newElement: DrawElement = {
      id: `element-${++elementIdRef.current}`,
      type: tool,
      color,
      lineWidth: brushSize,
      startPoint: point,
      userId,
      strokeStyle,
      opacity,
    };
    if (tool === "pen") newElement.points = [point];
    setCurrentElement(newElement);
  };

  const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      // Update cursor position for preview
      setCursorPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }

    if (isPanning && lastPanPoint) {
      if (rect) {
        const currentPoint = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
        setOffset({
          x: offset.x + (currentPoint.x - lastPanPoint.x),
          y: offset.y + (currentPoint.y - lastPanPoint.y),
        });
        setLastPanPoint(currentPoint);
      }
      return;
    }

    if (!isDrawing || !currentElement) return;
    let point = getMousePos(e);

    // Apply Shift constraint for straight lines and perfect shapes
    if (isShiftPressed && currentElement.startPoint) {
      const start = currentElement.startPoint;
      const dx = point.x - start.x;
      const dy = point.y - start.y;

      if (tool === "line") {
        // Snap to horizontal or vertical
        if (Math.abs(dx) > Math.abs(dy)) {
          point = { x: point.x, y: start.y };
        } else {
          point = { x: start.x, y: point.y };
        }
      } else if (tool === "rectangle" || tool === "circle") {
        // Make square/circle (1:1 ratio)
        const size = Math.max(Math.abs(dx), Math.abs(dy));
        point = {
          x: start.x + (dx > 0 ? size : -size),
          y: start.y + (dy > 0 ? size : -size),
        };
      }
    }

    if (tool === "pen") {
      setCurrentElement({
        ...currentElement,
        points: [...(currentElement.points || []), point],
      });
    } else {
      setCurrentElement({ ...currentElement, endPoint: point });
    }
  };

  const handleMouseUp = async () => {
    if (isPanning) {
      setIsPanning(false);
      setLastPanPoint(null);
      return;
    }

    if (isDrawing && currentElement) {
      const newElements = [...elements, currentElement];
      setElements(newElements);
      const newHistory = history.slice(0, historyStep + 1);
      newHistory.push(newElements);
      setHistory(newHistory);
      setHistoryStep(newHistory.length - 1);

      // Save to Supabase for real-time sync
      await supabase.from("drawing_elements").insert({
        element_id: currentElement.id,
        type: currentElement.type,
        points: currentElement.points || null,
        start_point: currentElement.startPoint || null,
        end_point: currentElement.endPoint || null,
        text: currentElement.text || null,
        color: currentElement.color,
        line_width: currentElement.lineWidth,
        user_id: currentElement.userId,
        stroke_style: currentElement.strokeStyle || "solid",
        opacity: currentElement.opacity || 100,
      });

      setCurrentElement(null);
    }
    setIsDrawing(false);
  };

  // Touch event handlers for mobile support
  const getTouchPos = (e: React.TouchEvent<HTMLCanvasElement>): Point => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    const touch = e.touches[0] || e.changedTouches[0];
    return {
      x: (touch.clientX - rect.left - offset.x) / scale,
      y: (touch.clientY - rect.top - offset.y) / scale,
    };
  };

  // Get pressure from touch (Apple Pencil support)
  const getTouchPressure = (e: React.TouchEvent<HTMLCanvasElement>): number => {
    const touch = e.touches[0] || e.changedTouches[0];
    // Apple Pencil and some styluses support pressure (force property)
    // @ts-expect-error - force is not in TypeScript definitions but exists on touch
    return touch.force !== undefined ? touch.force : 1;
  };

  const getTouchDistance = (e: React.TouchEvent<HTMLCanvasElement>): number => {
    if (e.touches.length < 2) return 0;
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();

    // Two-finger pinch to zoom
    if (e.touches.length === 2) {
      setLastTouchDistance(getTouchDistance(e));
      return;
    }

    // Two-finger pan
    if (e.touches.length === 2 || tool === "pan") {
      setIsPanning(true);
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const touch = e.touches[0];
        setLastPanPoint({
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top,
        });
      }
      return;
    }

    // Single touch - same as mouse down
    const point = getTouchPos(e);

    if (tool === "eraser") {
      const elementToRemove = elements.find((element) => {
        if (element.userId !== userId) return false;
        if (element.type === "pen" && element.points) {
          return element.points.some(
            (p) => Math.abs(p.x - point.x) < 10 && Math.abs(p.y - point.y) < 10
          );
        } else if (element.startPoint && element.endPoint) {
          const minX = Math.min(element.startPoint.x, element.endPoint.x);
          const maxX = Math.max(element.startPoint.x, element.endPoint.x);
          const minY = Math.min(element.startPoint.y, element.endPoint.y);
          const maxY = Math.max(element.startPoint.y, element.endPoint.y);
          return (
            point.x >= minX - 10 &&
            point.x <= maxX + 10 &&
            point.y >= minY - 10 &&
            point.y <= maxY + 10
          );
        }
        return false;
      });

      if (elementToRemove) {
        const newElements = elements.filter(
          (el) => el.id !== elementToRemove.id
        );
        setElements(newElements);
        const newHistory = history.slice(0, historyStep + 1);
        newHistory.push(newElements);
        setHistory(newHistory);
        setHistoryStep(newHistory.length - 1);

        supabase
          .from("drawing_elements")
          .delete()
          .eq("element_id", elementToRemove.id);
      }
      return;
    }

    setIsDrawing(true);

    if (tool === "text") {
      const text = prompt("Enter text:");
      if (text) {
        const newElement: DrawElement = {
          id: `element-${++elementIdRef.current}`,
          type: "text",
          startPoint: point,
          text,
          color,
          lineWidth: brushSize,
          userId,
          strokeStyle,
          opacity,
        };
        const newElements = [...elements, newElement];
        setElements(newElements);
        const newHistory = history.slice(0, historyStep + 1);
        newHistory.push(newElements);
        setHistory(newHistory);
        setHistoryStep(newHistory.length - 1);
      }
      return;
    }

    // Get pressure for Apple Pencil support
    const pressure = getTouchPressure(e);
    const pressureSensitiveWidth = Math.max(1, brushSize * pressure);

    const newElement: DrawElement = {
      id: `element-${++elementIdRef.current}`,
      type: tool,
      color,
      lineWidth: pressureSensitiveWidth,
      startPoint: point,
      userId,
      strokeStyle,
      opacity,
    };
    if (tool === "pen") newElement.points = [point];
    setCurrentElement(newElement);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();

    // Pinch to zoom
    if (e.touches.length === 2 && lastTouchDistance) {
      const newDistance = getTouchDistance(e);
      const scaleChange = newDistance / lastTouchDistance;
      setScale(Math.max(0.1, Math.min(5, scale * scaleChange)));
      setLastTouchDistance(newDistance);
      return;
    }

    // Pan
    if (isPanning && lastPanPoint && e.touches.length >= 1) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const touch = e.touches[0];
        const currentPoint = {
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top,
        };
        setOffset({
          x: offset.x + (currentPoint.x - lastPanPoint.x),
          y: offset.y + (currentPoint.y - lastPanPoint.y),
        });
        setLastPanPoint(currentPoint);
      }
      return;
    }

    if (!isDrawing || !currentElement) return;
    const point = getTouchPos(e);

    if (tool === "pen") {
      setCurrentElement({
        ...currentElement,
        points: [...(currentElement.points || []), point],
      });
    } else {
      setCurrentElement({ ...currentElement, endPoint: point });
    }
  };

  const handleTouchEnd = async () => {
    setLastTouchDistance(null);

    if (isPanning) {
      setIsPanning(false);
      setLastPanPoint(null);
      return;
    }

    if (isDrawing && currentElement) {
      const newElements = [...elements, currentElement];
      setElements(newElements);
      const newHistory = history.slice(0, historyStep + 1);
      newHistory.push(newElements);
      setHistory(newHistory);
      setHistoryStep(newHistory.length - 1);

      await supabase.from("drawing_elements").insert({
        element_id: currentElement.id,
        type: currentElement.type,
        points: currentElement.points || null,
        start_point: currentElement.startPoint || null,
        end_point: currentElement.endPoint || null,
        text: currentElement.text || null,
        color: currentElement.color,
        line_width: currentElement.lineWidth,
        user_id: currentElement.userId,
        stroke_style: currentElement.strokeStyle || "solid",
        opacity: currentElement.opacity || 100,
      });

      setCurrentElement(null);
    }
    setIsDrawing(false);
  };

  const handleUndo = () => {
    if (historyStep > 0) {
      setHistoryStep(historyStep - 1);
      setElements(history[historyStep - 1]);
    }
  };

  const handleRedo = () => {
    if (historyStep < history.length - 1) {
      setHistoryStep(historyStep + 1);
      setElements(history[historyStep + 1]);
    }
  };

  const handleZoom = (delta: number) => {
    setScale((prev) => Math.max(0.1, Math.min(5, prev + delta)));
  };

  return (
    <motion.div
      className="mt-16 mb-8"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="text-center mb-8">
        <motion.h2
          className="text-5xl md:text-6xl font-extrabold mb-4"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600">
            Free Drawing Canvas
          </span>
        </motion.h2>
        <motion.p
          className="text-lg text-gray-700 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          Vẽ tự do với nhiều công cụ như Excalidraw - Thả ga sáng tạo!
        </motion.p>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
          <div className="p-6">
            <motion.div
              className="relative bg-white rounded-2xl shadow-inner border-2 border-gray-200 overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              style={
                {
                  // Prevent Safari bounce effect and improve iPad experience
                  WebkitOverflowScrolling: "touch",
                  WebkitTouchCallout: "none",
                } as React.CSSProperties
              }
            >
              <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchEnd}
                className={`w-full h-[600px] touch-none select-none ${
                  tool === "pan"
                    ? "cursor-grab active:cursor-grabbing"
                    : tool === "eraser"
                    ? ""
                    : "cursor-crosshair"
                }`}
                style={{
                  touchAction: "none",
                  cursor:
                    tool === "eraser"
                      ? `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2'%3E%3Cpath d='M7 21h10'/%3E%3Cpath d='M20 8L8 20l-5-5L15 3l5 5z'/%3E%3Cpath d='M8 20L3 15'/%3E%3C/svg%3E") 12 12, auto`
                      : undefined,
                }}
              />

              {/* Floating Toolbar - Top Center like Excalidraw - Responsive */}
              <motion.div
                className="absolute top-2 md:top-4 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-md rounded-xl md:rounded-2xl shadow-2xl border border-gray-200/50 p-1.5 md:p-2 max-w-[95vw] overflow-x-auto"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center gap-1 md:gap-2">
                  {/* Tools */}
                  <div className="flex gap-0.5 md:gap-1 px-1 md:px-2 border-r border-gray-200">
                    {tools.map((t) => (
                      <motion.button
                        key={t.id}
                        onClick={() => setTool(t.id)}
                        className={`p-2 md:p-2.5 rounded-lg transition-all relative group ${
                          tool === t.id
                            ? "bg-purple-100 text-purple-600 shadow-md"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        title={`${t.label} (${t.key})`}
                      >
                        <t.icon className="w-4 h-4" />
                        {/* Tooltip - Hidden on mobile */}
                        <div className="hidden md:block absolute -bottom-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          {t.label}{" "}
                          <span className="text-gray-400">({t.key})</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  {/* Undo/Redo */}
                  <div className="flex gap-0.5 md:gap-1 px-1 md:px-2 border-r border-gray-200">
                    <motion.button
                      onClick={handleUndo}
                      disabled={historyStep <= 0}
                      className="p-2 md:p-2.5 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-30 relative group"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Undo (Ctrl+Z)"
                    >
                      <FiRotateCcw className="w-3.5 md:w-4 h-3.5 md:h-4" />
                      <div className="hidden md:block absolute -bottom-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        Undo <span className="text-gray-400">(Ctrl+Z)</span>
                      </div>
                    </motion.button>
                    <motion.button
                      onClick={handleRedo}
                      disabled={historyStep >= history.length - 1}
                      className="p-2 md:p-2.5 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-30 relative group"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Redo (Ctrl+Y)"
                    >
                      <FiRotateCw className="w-3.5 md:w-4 h-3.5 md:h-4" />
                      <div className="hidden md:block absolute -bottom-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        Redo <span className="text-gray-400">(Ctrl+Y)</span>
                      </div>
                    </motion.button>
                  </div>

                  {/* Grid */}
                  <div className="flex gap-0.5 md:gap-1 px-1 md:px-2 border-r border-gray-200">
                    <motion.button
                      onClick={() => setShowGrid(!showGrid)}
                      className={`p-2 md:p-2.5 rounded-lg transition-all relative group ${
                        showGrid
                          ? "bg-purple-100 text-purple-600 shadow-md"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title={showGrid ? "Hide Grid (G)" : "Show Grid (G)"}
                    >
                      <FiGrid className="w-3.5 md:w-4 h-3.5 md:h-4" />
                      <div className="hidden md:block absolute -bottom-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        {showGrid ? "Hide" : "Show"} Grid{" "}
                        <span className="text-gray-400">(G)</span>
                      </div>
                    </motion.button>
                  </div>

                  {/* Collaborative Status */}
                  <div className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3">
                    <div
                      className={`w-1.5 md:w-2 h-1.5 md:h-2 rounded-full ${
                        isConnected ? "bg-green-500" : "bg-gray-400"
                      }`}
                    />
                    <FiUsers className="w-3.5 md:w-4 h-3.5 md:h-4 text-gray-600" />
                    <span className="text-xs font-semibold text-gray-700">
                      {onlineUsers}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Shift Key Indicator - Hidden on mobile */}
              {isShiftPressed && (
                <motion.div
                  className="hidden md:flex absolute top-20 right-4 bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg items-center gap-2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <span className="text-sm font-semibold">⇧ Shift</span>
                  <span className="text-xs opacity-80">
                    {tool === "line" ? "Straight lines" : "Perfect shapes"}
                  </span>
                </motion.div>
              )}

              {/* Tool Settings Panel - Left Side - Hidden on mobile */}
              {(tool === "pen" ||
                tool === "line" ||
                tool === "arrow" ||
                tool === "rectangle" ||
                tool === "circle") && (
                <motion.div
                  className="hidden md:block absolute left-4 top-20 bg-gray-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700/50 p-4 w-56"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  {/* Stroke Color */}
                  <div className="mb-4">
                    <label className="text-white text-xs font-medium mb-2 block">
                      Stroke
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {colors.map((c) => (
                        <button
                          key={c.value}
                          onClick={() => setColor(c.value)}
                          className={`w-8 h-8 rounded-lg transition-all ${
                            color === c.value
                              ? "ring-2 ring-purple-400 scale-110"
                              : "hover:scale-105"
                          }`}
                          style={{ backgroundColor: c.value }}
                          title={c.name}
                        />
                      ))}
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer"
                        title="Custom"
                      />
                    </div>
                  </div>

                  {/* Stroke Width */}
                  <div className="mb-4">
                    <label className="text-white text-xs font-medium mb-2 block">
                      Stroke width{" "}
                      <span className="text-gray-400 text-xs">([/])</span>
                    </label>
                    <div className="flex gap-2">
                      {[1, 3, 5].map((size) => (
                        <button
                          key={size}
                          onClick={() => setBrushSize(size)}
                          className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
                            brushSize === size
                              ? "bg-purple-600 text-white"
                              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          }`}
                          title={`${size}px ${
                            size === 1
                              ? "(Thin)"
                              : size === 3
                              ? "(Medium)"
                              : "(Thick)"
                          }`}
                        >
                          {size === 1 ? "Thin" : size === 3 ? "Med" : "Thick"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Stroke Style */}
                  <div className="mb-4">
                    <label className="text-white text-xs font-medium mb-2 block">
                      Stroke style
                    </label>
                    <div className="flex gap-2">
                      {(["solid", "dashed", "dotted"] as const).map((style) => (
                        <button
                          key={style}
                          onClick={() => setStrokeStyle(style)}
                          className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
                            strokeStyle === style
                              ? "bg-purple-600 text-white"
                              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          }`}
                        >
                          {style === "solid"
                            ? "—"
                            : style === "dashed"
                            ? "- -"
                            : "· ·"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Opacity */}
                  <div>
                    <label className="text-white text-xs font-medium mb-2 block">
                      Opacity <span className="text-gray-400">{opacity}%</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={opacity}
                      onChange={(e) => setOpacity(Number(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                  </div>
                </motion.div>
              )}

              {/* Brush Size & Zoom - Bottom Center */}
              <motion.div
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/50 px-4 py-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <div className="flex items-center gap-6">
                  {/* Brush Size */}
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 text-xs font-medium">
                      Size:
                    </span>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={brushSize}
                      onChange={(e) => setBrushSize(Number(e.target.value))}
                      className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                    <span className="text-gray-800 font-bold text-xs w-6 text-center">
                      {brushSize}
                    </span>
                  </div>

                  {/* Zoom Controls */}
                  <div className="flex items-center gap-2 border-l border-gray-200 pl-6">
                    <span className="text-gray-600 text-xs font-medium">
                      Zoom:
                    </span>
                    <motion.button
                      onClick={() => handleZoom(-0.1)}
                      className="px-2 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      -
                    </motion.button>
                    <span className="text-gray-800 text-xs font-bold w-12 text-center">
                      {Math.round(scale * 100)}%
                    </span>
                    <motion.button
                      onClick={() => handleZoom(0.1)}
                      className="px-2 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      +
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        setScale(1);
                        setOffset({ x: 0, y: 0 });
                      }}
                      className="px-2 py-1 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-700 text-xs font-medium"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Reset
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Watermark */}
              <div className="absolute bottom-4 right-4 text-gray-400 text-xs font-semibold opacity-50">
                Alliance Organization
              </div>
            </motion.div>

            <motion.div
              className="mt-4 text-center text-sm text-gray-600"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <p>
                💡 Tip: Select tool from top, pick color on left, adjust size &
                zoom at bottom!
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
