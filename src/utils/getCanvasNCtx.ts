const getCanvasNCtx = (ref: React.RefObject<HTMLCanvasElement>): [HTMLCanvasElement, CanvasRenderingContext2D] => {
  // Получаем текущий элемент canvas из ссылки
  const canvas = ref.current!;
  
  // Получаем 2D контекст для рисования на canvas
  const ctx = canvas.getContext('2d', {
    willReadFrequently: true  // Опция указывает, что контекст будет часто читаться
  })!;
  
  // Возвращаем кортеж, содержащий элемент canvas и его 2D контекст
  return [canvas, ctx];
}
// Экспортируем функцию по умолчанию
export default getCanvasNCtx;