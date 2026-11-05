import { useEffect, useRef } from 'react';

export type SecurityViolationType =
  | 'clipboard'
  | 'devtools'
  | 'window_blur'
  | 'drag_drop'
  | 'sandbox_violation';

export interface SecurityViolationDetail {
  type: SecurityViolationType;
  detail: string;
  timestamp: string;
}

export function recordSecurityViolation(type: SecurityViolationType, detail: string) {
  try {
    const raw = localStorage.getItem('cp_security_events') || '[]';
    const list = JSON.parse(raw);
    const item: SecurityViolationDetail = {
      type,
      detail,
      timestamp: new Date().toISOString(),
    };
    list.unshift(item);
    // Maksimal 50 ta yozuvni saqlaymiz
    if (list.length > 50) list.pop();
    localStorage.setItem('cp_security_events', JSON.stringify(list));
  } catch {}
}

export function useClipboardRestrictions(
  enabled: boolean = true,
  onViolation?: (violation: SecurityViolationDetail) => void,
) {
  const lastViolationTime = useRef<number>(0);

  const triggerViolation = (type: SecurityViolationType, detail: string) => {
    const now = Date.now();
    // 700ms ichida ketma-ket qayta signal yuborilmasligi uchun (debouncing)
    if (now - lastViolationTime.current < 700) return;
    lastViolationTime.current = now;

    recordSecurityViolation(type, detail);
    if (onViolation) {
      onViolation({
        type,
        detail,
        timestamp: new Date().toISOString(),
      });
    }
  };

  useEffect(() => {
    if (!enabled) return;

    // 1. O'ng tugma kontekst menyusini bloklash
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      triggerViolation('clipboard', 'Sichqonchaning o‘ng tugmasi (kontekst menyu) bloklandi.');
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
          triggerViolation(
            'clipboard',
            `Qisqa klavish orqali ${key === 'v' ? 'matn qo‘yish (Paste)' : 'nusxalash (Copy/Cut)'} urinishi bloklandi.`,
          );
          return false;
        }
      }

      // Shift+Insert (alternative paste)
      if (e.shiftKey && e.key === 'Insert') {
        e.preventDefault();
        e.stopPropagation();
        triggerViolation('clipboard', 'Shift+Insert orqali matn qo‘yish urinishi to‘xtatildi.');
        return false;
      }

      // F12 va DevTools kombinatsiyalari
      if (e.key === 'F12' || (isCtrlOrMeta && e.shiftKey && e.key.toLowerCase() === 'i')) {
        e.preventDefault();
        e.stopPropagation();
        triggerViolation('devtools', 'Dasturchi asboblari (DevTools/F12) ochishga urinish bloklandi.');
        return false;
      }
    };

    // 3. Paste va Copy hodisalarini ushlash
    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      triggerViolation('clipboard', 'Tashqi matnni muharrirga qo‘yish (Paste hodisasi) bloklandi.');
      return false;
    };

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      triggerViolation('clipboard', 'Muharrirdan nusxa olish (Copy hodisasi) bloklandi.');
      return false;
    };

    const handleCut = (e: ClipboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      triggerViolation('clipboard', 'Muharrirdan qirqib olish (Cut hodisasi) bloklandi.');
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
      triggerViolation('drag_drop', 'Tashqi fayl yoki matnni sudrab olib kirish (Drag&Drop) bloklandi.');
    };

    // 5. Oynadan chiqish / Boshqa dasturga o'tish (Alt+Tab, Windows tugmasi)
    const handleWindowBlur = () => {
      triggerViolation('window_blur', 'Dastur oynasi fokusi yo‘qotildi (Alt+Tab yoki boshqa dasturga o‘tildi).');
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerViolation('window_blur', 'Dastur ekrani yashirildi yoki orqa fonga o‘tkazildi.');
      }
    };

    document.addEventListener('contextmenu', handleContextMenu, true);
    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('paste', handlePaste, true);
    document.addEventListener('copy', handleCopy, true);
    document.addEventListener('cut', handleCut, true);
    document.addEventListener('dragover', handleDragOver, true);
    document.addEventListener('drop', handleDrop, true);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu, true);
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('paste', handlePaste, true);
      document.removeEventListener('copy', handleCopy, true);
      document.removeEventListener('cut', handleCut, true);
      document.removeEventListener('dragover', handleDragOver, true);
      document.removeEventListener('drop', handleDrop, true);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled]);
}
