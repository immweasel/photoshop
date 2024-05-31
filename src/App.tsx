import React, { useEffect, useRef, useState } from 'react';
import { Tabs, Modal, Button } from 'antd';
import ChangeSizeModal from './components/ChangeSizeModal/ChangeSizeModal';
import tabsItemsOnFunc from './utils/tabsItemsOnFunc';
import getNewDataNearestNeighbour from './utils/getNewDataNearestNeighbour';
import SideMenu from './components/SideMenu/SideMenu';
import CurvesModal from './components/CurvesModal/CurvesModal';
import FilterModal from './components/FilterModal/FilterModal';
import getCanvasNCtx from './utils/getCanvasNCtx';
import './App.css'

// Интерфейс для загруженного изображения
export interface LoadedImageI {
  imageUri: string
  imageOriginalWidth: number
  imageOriginalHeight: number
}

// Интерфейс для информации о пикселе
export interface PixelInfoI {
  rgb: [number, number, number]
  x: number
  y: number
}

// Интерфейс для модального окна
interface ModalI {
  show: boolean
  title: string
  content: React.ReactNode
}

function App() {
  // Создаем ссылки для доступа к DOM элементам
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgViewRef = useRef<HTMLDivElement>(null);
  
  // Состояние для управления перетаскиванием изображения
  const dragRef = useRef({
    drag: false,
    startX: 0,
    startY: 0,
    scrollX: 0,
    scrollY: 0,
  });

  // Состояния для хранения данных изображения и интерфейса
  const [loadedImage, setLoadedImage] = useState<LoadedImageI>({
    imageUri: '',
    imageOriginalWidth: 0,
    imageOriginalHeight: 0
  });
  const [scale, setImageScale] = useState(100);
  const [pixelInfo, setPixelInfo] = useState<PixelInfoI>({
    rgb: [0, 0, 0],
    x: 0,
    y: 0,
  });
  const [modal, setModal] = useState<ModalI>({
    show: false,
    title: '',
    content: null,
  });
  const [currentTool, setCurrentTool] = useState(0);
  const [color1, setColor1] = useState<PixelInfoI>({
    rgb: [0, 0, 0],
    x: 0,
    y: 0
  });
  const [color2, setColor2] = useState<PixelInfoI>({
    rgb: [0, 0, 0],
    x: 0,
    y: 0
  });

  // Эффект для загрузки и отрисовки изображения при изменении URI изображения
  useEffect(() => {
    const imgPromise = imageUriToImgPromise(loadedImage.imageUri);
    imgPromise.then((img) => {
      renderImageFull(img);
      setLoadedImage({
        ...loadedImage,
        imageOriginalWidth: img.naturalWidth, 
        imageOriginalHeight: img.naturalHeight}
      );
    });
  }, [loadedImage.imageUri]);

  // Эффект для изменения масштаба изображения
  useEffect(() => {
    changeImageScale(scale);
  }, [scale]);

  // Преобразование URI изображения в объект Image
  const imageUriToImgPromise = (uri: string): Promise<HTMLImageElement> => {
    return new Promise(function (resolve, _) {
      const img = new Image();
      img.src = uri;
      img.onload = () => {
        resolve(img);
      };
    });
  };

  // Отрисовка изображения на канвасе
  const renderImage = () => {
    const [canvas, ctx] = getCanvasNCtx(canvasRef);
    const imgPromise = imageUriToImgPromise(loadedImage.imageUri);
    imgPromise.then((img) => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    });
  };

  // Полная отрисовка изображения с учетом масштабирования
  const renderImageFull = (img: HTMLImageElement) => {
    const [canvas, _] = getCanvasNCtx(canvasRef);
    
    const maxWidth = canvas.parentElement!.clientWidth;
    const maxHeight = canvas.parentElement!.clientHeight;

    const scale = Math.min(
      maxWidth / img.width,
      maxHeight / img.height
    );

    canvas.width = img.width * scale;
    canvas.height = img.height * scale;
    
    setImageScale(Math.floor(scale * 100));
    renderImage();
  };

  // Изменение масштаба изображения
  const changeImageScale = (scale: number) => {
    const [canvas, _] = getCanvasNCtx(canvasRef);
    
    const scaleMultiplyer = scale / 100; 

    const imgPromise = imageUriToImgPromise(loadedImage.imageUri);
    imgPromise.then((img) => {
      canvas.width = img.width * scaleMultiplyer;
      canvas.height = img.height * scaleMultiplyer;
      renderImage();
    });
  };

  // Загрузка изображения в канвас
  const uploadImageToCanvas = (file: File) => {
    setLoadedImage({
      ...loadedImage,
      imageUri: URL.createObjectURL(file),
    });
  };

  // Получение информации о пикселе при клике на канвас
  const getPixelInfo = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const [_, ctx] = getCanvasNCtx(canvasRef);
    const mouseX = e.nativeEvent.offsetX;
    const mouseY = e.nativeEvent.offsetY;
    const p = ctx.getImageData(mouseX, mouseY, 1, 1).data;
    return {
      p: p,
      x: mouseX,
      y: mouseY,
    };
  };

  // Обновление информации о пикселе при перемещении мыши по канвасу
  const pixelInfoChange = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { p, x, y } = getPixelInfo(e);
    setPixelInfo({ 
      rgb: [p[0], p[1], p[2]], 
      x: x, 
      y: y, 
    }); 
  };

  // Изменение цвета в зависимости от текущего инструмента и нажатия клавиш
  const colorChange = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (currentTool !== 1) return;
    const { p, x, y } = getPixelInfo(e);
    if (e.altKey) {
      return setColor2({ 
        rgb: [p[0], p[1], p[2]], 
        x: x, 
        y: y, 
      }); 
    }
    return setColor1({ 
      rgb: [p[0], p[1], p[2]], 
      x: x, 
      y: y, 
    }); 
  };

  // Обработка изменения масштаба слайдером
  const onSliderChange = (scale: number) => {
    setImageScale(scale);
  };

  // Изменение текущего инструмента
  const onCurrentToolChange = (id: number) => {
    setCurrentTool(id);
  };

  // Изменение размера изображения
  const resizeImage = (newWidth: number, newHeight: number) => {
    const [canvas, ctx] = getCanvasNCtx(canvasRef);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newData = getNewDataNearestNeighbour(imageData, newWidth, newHeight);
    setLoadedImage({ ...loadedImage, imageUri: newData });
    setModal({ ...modal, show: false }); // Закрыть модальное окно
  };

  // Скачивание изображения
  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = new Image();
    img.src = loadedImage.imageUri;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'edited-image.png';
      link.click();
    };
  };

  // Открытие модального окна
  const openModal = (
    title: string,
    content: React.ReactNode
  ) => {
    return setModal({
      ...modal,
      show: true,
      title: title,
      content: content
    });
  };

  const closeModal = () => {
    setModal({...modal, show: false});
  }

  // Обработка начала перетаскивания изображения
  const onImgViewMouseDown = (e: React.MouseEvent) => {
    const imgView = e.target as HTMLDivElement;
    dragRef.current = {
      ...dragRef.current,
      drag: true,
      startX: e.pageX - imgView.offsetLeft,
      startY: e.pageY - imgView.offsetTop,
    };
    imgViewRef.current!!.style.cursor = "grabbing";
  };

  // Обработка завершения перетаскивания изображения
  const onImgViewMouseUp = () => {
    dragRef.current.drag = false;
    imgViewRef.current!!.style.cursor = "auto";
  };

  // Обработка перетаскивания изображения
  const onImgViewMouseMove = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!dragRef.current.drag || !imgViewRef.current) return;
    
    const maxScrollLeft = imgViewRef.current.scrollWidth - imgViewRef.current.clientWidth;
    const maxScrollTop = imgViewRef.current.scrollHeight - imgViewRef.current.clientHeight;

    const imgView = e.target as HTMLDivElement;
    const x = e.pageX - imgView.offsetLeft;
    const y = e.pageY - imgView.offsetTop;
    const walkX = (x - dragRef.current.startX) * 1;
    const walkY = (y - dragRef.current.startY) * 1;

    if ((imgViewRef.current.scrollLeft - walkX >= maxScrollLeft && maxScrollLeft !== 0) || (imgViewRef.current.scrollLeft - walkX < 0 && maxScrollLeft !== 0)) return;
    if ((imgViewRef.current.scrollTop - walkY >= maxScrollTop && maxScrollTop !== 0) || (imgViewRef.current.scrollTop - walkY < 0  && maxScrollTop !== 0)) return;
    
    imgViewRef.current.scrollLeft = dragRef.current.scrollX - walkX;
    dragRef.current.scrollX = dragRef.current.scrollX - walkX;
    dragRef.current.startX = x;
    
    imgViewRef.current.scrollTop = dragRef.current.scrollY - walkY;
    dragRef.current.scrollY = dragRef.current.scrollY - walkY;
    dragRef.current.startY = y;
  };

  // Изменение загруженного изображения
  const changeLoadedImage = (data: string) => {
    setLoadedImage({ ...loadedImage, imageUri: data });
    setModal({ ...modal, show: false }); // Закрыть модальное окно
  };

  return (
    <div className="container">
      <div className="app">
        <div className="menu-panel">
          <Button className="upload" type="default" onClick={ () => openModal(
            "Загрузить изображение",
            <Tabs defaultActiveKey="1" items={ tabsItemsOnFunc(uploadImageToCanvas) } />
          )}>
            Загрузить изображение
          </Button>
          <Button className="change-size" type="default" onClick={ () => openModal(
            "Изменение размера",
            <ChangeSizeModal 
              width={ loadedImage.imageOriginalWidth } 
              height={ loadedImage.imageOriginalHeight } 
              onChangeSizeSubmit={ (width, height) => resizeImage(width, height) }
            />
          )}>
            Изменить размер
          </Button>
          <Button className="download" type="default" onClick={ downloadImage }>
            Сохранить
          </Button>
          <Button className="curves" type="default" onClick={ () => {
            setImageScale(100);  
            openModal(
              "Коррекция градиента",
              <CurvesModal 
                imageRef={ canvasRef }
                onGammaCorrectionChange={ (data) => changeLoadedImage(data) }
                closeModal={closeModal}
              />
            )
          }}>
            Кривые
          </Button>
          <Button className="filtration" type="default" onClick={ () => {
            setImageScale(100);  
            openModal(
              "Фильтрация",
              <FilterModal 
                imageRef={ canvasRef }
                onFilterChange={ (data) => changeLoadedImage(data) }
                closeModal={closeModal}
              />
            )
          }}>
            Фильтры
          </Button>
        </div>
        <div className="work-panel">
          { currentTool === 0
            ?
            <div
              ref={ imgViewRef }
              className="img-view"
              onMouseDown={ onImgViewMouseDown }
              onMouseMove={ onImgViewMouseMove }
              onMouseUp={ onImgViewMouseUp }
            >
              <canvas 
                ref={ canvasRef } 
                className='canvas' 
                onMouseMove={ pixelInfoChange } 
                onClick={ colorChange }
              />
            </div>
            :
            <div
              ref={ imgViewRef }
              className="img-view"
            >
              <canvas 
                ref={ canvasRef } 
                className='canvas' 
                onMouseMove={ pixelInfoChange } 
                onClick={ colorChange }
              />
            </div>
          }
          <SideMenu
            loadedImage={ loadedImage }
            pixelInfo={ pixelInfo }
            color1={ color1 }
            color2={ color2 }
            scale={ scale }
            currentTool={ currentTool }
            onCurrentToolChange={ onCurrentToolChange }
            onSliderChange={ onSliderChange }
          />
        </div>
      </div>
      <Modal 
        title={ modal.title } 
        open={ modal.show } 
        onCancel={ () => setModal({ ...modal, show: false }) }
        onOk={ () => setModal({ ...modal, show: false }) }
        footer={[]}
      >
        { modal.content }
      </Modal>
    </div>
  );
}

export default App;
