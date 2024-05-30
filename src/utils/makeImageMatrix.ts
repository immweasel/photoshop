export default function makeImageMatrix(srcData: Uint8ClampedArray, width: number) {
  // Инициализация пустой матрицы изображения
  const imageMatrix: number[][] = [];

  // Цикл по строкам изображения
  for (let y = 1; y <= srcData.length / (width * 4); y++) {
    // Инициализация пустой строки в матрице
    imageMatrix[y] = [];
    let x = 1; // Индекс столбца
    
    // Цикл по элементам строки в исходном массиве данных
    for (let i = width * 4 * (y - 1); i < width * 4 * y; i++) {
      // Заполнение строки матрицы значениями из исходного массива данных
      imageMatrix[y][x] = srcData[i];
      x += 1; // Переход к следующему столбцу
    }
  }
  
  // Возвращение заполненной матрицы изображения
  return imageMatrix;
}