// Функция для подготовки матрицы изображения для операций по выделению краев
export default function edgeMatrixPrepare(imageMatrix: number[][], width: number, height: number) {
    // Умножаем ширину на 4, так как каждая пиксель содержит 4 компоненты (RGBA)
    width = width * 4;
    const newImageMatrix: number[][] = [];

    // Инициализируем новую матрицу изображения с дополнительными строками
    for (let y = 1; y <= height + 2; y++) {
    newImageMatrix[y] = [];
    }

    // Вспомогательная функция для копирования значений RGBA из одного места матрицы в другое
function setRGBA(x1: number, y1: number, x2: number, y2: number) {
    newImageMatrix[y1][x1 - 3] = newImageMatrix[y2][x2 - 3];
    newImageMatrix[y1][x1 - 2] = newImageMatrix[y2][x2 - 2];
    newImageMatrix[y1][x1 - 1] = newImageMatrix[y2][x2 - 1];
    newImageMatrix[y1][x1] = newImageMatrix[y2][x2];
    }

    // Заполняем новую матрицу значениями из исходной матрицы
for (let y = 1; y <= height; y++) {
    for (let x = 4; x <= width; x += 4) {
        newImageMatrix[y + 1][x - 3 + 4] = imageMatrix[y][x - 3];
        newImageMatrix[y + 1][x - 2 + 4] = imageMatrix[y][x - 2];
        newImageMatrix[y + 1][x - 1 + 4] = imageMatrix[y][x - 1];
        newImageMatrix[y + 1][x + 4] = imageMatrix[y][x];
    }
}

    // Заполнение верхней и нижней границ новой матрицы
for (let x = 8; x <= width + 4; x += 4) {
    setRGBA(x, 1, x, 2);
}
for (let x = 8; x <= width + 4; x += 4) {
    setRGBA(x, height + 2, x, height + 1);
}

    // Заполнение левой и правой границ новой матрицы
for (let y = 2; y <= height + 1; y++) {
    setRGBA(4, y, 8, y);
}
for (let y = 2; y <= height + 1; y++) {
    setRGBA(width + 8, y, width + 4, y);
}

    // Заполнение углов новой матрицы
    setRGBA(4, 1, 8, 2);
    setRGBA(width + 8, 1, width + 4, 2);
    setRGBA(4, height + 2, 8, height + 2);
    setRGBA(width + 8, height + 2, width + 4, height + 1);

    // Возвращаем подготовленную матрицу изображения
    return newImageMatrix;
}
