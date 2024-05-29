const getNewDataNearestNeighbour = (imageData: ImageData, newWidth: number, newHeight: number) => {
    const newCanvas = document.createElement('canvas');
    newCanvas.width = newWidth;
    newCanvas.height = newHeight;
    //контекст рисования 2д
    const newCtx = newCanvas.getContext('2d');
    
    //данные изображения и его размеры
    const srcData = imageData.data;
    const srcWidth = imageData.width;
    const srcHeight = imageData.height;
    
    //массив для хранения данных нового изображения с учетом новых размеров
    const destData = new Uint8ClampedArray(newWidth * newHeight * 4);
    
    //масштабные коэффы котрые определяют соотношение между исх размерами и новыми
    const scaleX = srcWidth / newWidth;
    const scaleY = srcHeight / newHeight;
    
    //внешний цикл для прохода по строкам новомго изображения, внутренний по столбцам
    for (let y = 0; y < newHeight; y++) {
      for (let x = 0; x < newWidth; x++) {
        //в каждой итерации внутр цикла вычисляются координаты исх пикселя по формуле
        const srcX = Math.floor(x * scaleX);
        const srcY = Math.floor(y * scaleY);
    
        const srcIndex = (srcY * srcWidth + srcX) * 4;
        const destIndex = (y * newWidth + x) * 4;
    // значения красн зел син альфа исх пикселя копируются в соответст компоненты нового пикселя
        destData[destIndex] = srcData[srcIndex]; 
        destData[destIndex + 1] = srcData[srcIndex + 1]; 
        destData[destIndex + 2] = srcData[srcIndex + 2]; 
        destData[destIndex + 3] = srcData[srcIndex + 3]; 
      }
    }
    // новый компонент на основе массива и замеров нового изображения
    const newImageData = new ImageData(destData, newWidth, newHeight);
    //новые данные изображения помещаются на холст с координатами 0 0
    newCtx?.putImageData(newImageData, 0, 0);
    //возвращает данные юрл нового изображения
    return newCanvas.toDataURL();
}

export default getNewDataNearestNeighbour;
