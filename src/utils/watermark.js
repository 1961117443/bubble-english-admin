export const createWatermark = (text = 'Watermark Text') => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 200;
    canvas.height = 200;
    
    ctx.font = '16px Arial';
    ctx.fillStyle = 'rgba(128, 128, 128, 0.3)';
    ctx.rotate(-45 * Math.PI / 180);
    ctx.fillText(text, 0, 150);
  
    return canvas.toDataURL('image/png');
  };
  
  export const applyWatermark = (text) => {
    const watermark = document.createElement('div');
    watermark.style.position = 'fixed';
    watermark.style.top = '0';
    watermark.style.left = '0';
    watermark.style.width = '100%';
    watermark.style.height = '100%';
    watermark.style.backgroundImage = `url(${createWatermark(text)})`;
    watermark.style.zIndex = '9999';
    watermark.style.pointerEvents = 'none';
    watermark.id = 'vue-watermark';
  
    document.body.appendChild(watermark);
  
    // 防篡改监听（可选）
    const observer = new MutationObserver(() => {
      if (!document.getElementById('vue-watermark')) {
        document.body.appendChild(watermark);
      }
    });
    observer.observe(document.body, { childList: true });
  };