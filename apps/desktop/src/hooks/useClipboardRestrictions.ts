import { useEffect } from 'react';

export function useClipboardRestrictions(enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;

    // 1. O'ng tugma kontekst menyusini bloklash
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // 2. Klaviatura kombinatsiyalarini (Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Shift+I, F12) bloklash
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!e || !e.key) return;
      const isCtrlOrMeta = e.ctrlKey || e.metaKey;

      if (isCtrlOrMeta) {
        const key = e.key.toLowerCase();
        // Nusxalash, kesish, qo'yishni bloklash
        if (key === 'c' || key === 'v' || key === 'x' || key === 'insert') {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      }

      // Shift+Insert (alternative paste)
      if (e.shiftKey && e.key === 'Insert') {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // F12 va DevTools kombinatsiyalari
      if (e.key === 'F12' || (isCtrlOrMeta && e.shiftKey && e.key.toLowerCase() === 'i')) {
        e.preventDefault();
        return false;
      }
    };

    // 3. Paste va Copy hodisalarini ushlash
    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    const handleCut = (e: ClipboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    // 4. Tashqaridan matn sudrab olib kirishni (Drag & Drop) bloklash
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'none';
      }
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    document.addEventListener('contextmenu', handleContextMenu, true);
    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('paste', handlePaste, true);
    document.addEventListener('copy', handleCopy, true);
    document.addEventListener('cut', handleCut, true);
    document.addEventListener('dragover', handleDragOver, true);
    document.addEventListener('drop', handleDrop, true);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu, true);
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('paste', handlePaste, true);
      document.removeEventListener('copy', handleCopy, true);
      document.removeEventListener('cut', handleCut, true);
      document.removeEventListener('dragover', handleDragOver, true);
      document.removeEventListener('drop', handleDrop, true);
    };
  }, [enabled]);
}
