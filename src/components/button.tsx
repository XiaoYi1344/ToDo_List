import { useState, useRef, useEffect } from "react";

export default function ConfirmAction() {
  const [showBubble, setShowBubble] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  // Click ngoài để ẩn bóng chat
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        bubbleRef.current &&
        !bubbleRef.current.contains(event.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(event.target as Node)
      ) {
        setShowBubble(false);
      }
    }
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const onClickButton = () => {
    setShowBubble((prev) => !prev);
  };

  const onConfirm = () => {
    setResult("✅ Đã thực hiện tác vụ!");
    setShowBubble(false);
  };

  const onCancel = () => {
    setResult("❌ Tác vụ đã bị huỷ!");
    setShowBubble(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      <div className="relative">
        <button
          ref={btnRef}
          onClick={onClickButton}
          className="bg-yellow-300 px-6 py-3 rounded-lg shadow-md focus:outline-none"
          type="button"
        >
          Thực hiện tác vụ
        </button>

        <div
          ref={bubbleRef}
          className={`absolute bottom-full left-1/2 transform -translate-x-1/2 bg-yellow-100 text-gray-900 p-4 rounded-lg shadow-md transition-opacity duration-300 ${
            showBubble ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          } min-w-[200px] text-center`}
          style={{ whiteSpace: "normal" }}
        >
          <p className="mb-2 font-semibold">Bạn chắc chứ??</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={onConfirm}
              className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 text-sm"
              type="button"
            >
              Chắc
            </button>
            <button
              onClick={onCancel}
              className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 text-sm"
              type="button"
            >
              Không
            </button>
          </div>
          {/* Tam giác nhỏ dưới bóng chat */}
          <div
            style={{
              position: "absolute",
              bottom: "-6px",
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderTop: "6px solid #fef3c7",
            }}
          />
        </div>
      </div>

      <div className="mt-6 text-lg font-semibold text-gray-700 min-h-[24px]">{result}</div>
    </div>
  );
}
