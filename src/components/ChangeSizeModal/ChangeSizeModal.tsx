import { Select, InputNumber, Space, Checkbox, Flex, Button } from 'antd'; // Импорт компонентов из Ant Design и хуков из React
import { useEffect, useState, KeyboardEvent } from 'react';
import './ChangeSizeModal.css'; // Импорт стилей для компонента ChangeSizeModal

export interface ChangeSizeModalProps { // Интерфейс свойств компонента ChangeSizeModal
  width: number, // Ширина изображения
  height: number, // Высота изображения
  onChangeSizeSubmit: (width: number, height: number) => void; // Функция обратного вызова при изменении размеров изображения
}

const ChangeSizeModal = ({ // Компонент для изменения размеров изображения
  width, // Ширина изображения
  height, // Высота изображения
  onChangeSizeSubmit,
}: ChangeSizeModalProps) => {
  const [measure, setMeasure] = useState({ // Состояние компонента для хранения значений размеров
    type: 'pixels', // Единицы измерения: пиксели или проценты
    proportionFix: false, // Флаг сохранения пропорций
    width: width, // Текущая ширина
    height: height, // Текущая высота
    pWidth: 100, // Процент ширины
    pHeight: 100, // Процент высоты
  });
  const [_, setAlgorithm] = useState('closestNeighbour'); // Неиспользуемое состояние для выбора алгоритма интерполяции

  useEffect(() => { // Эффект для обновления значений размеров при изменении свойств width и height
    setMeasure({...measure, width: width, height: height});
  }, [width, height]);

  useEffect(() => {
    if (measure.proportionFix) {
      if (measure.width !== width) {
        const proportion = measure.width / width;
        setMeasure({...measure, height: Math.round(height * proportion)});
      } else if (measure.height !== height) {
        const proportion = measure.height / height;
        setMeasure({...measure, width: Math.round(width * proportion)});
      }
    }
  }, [measure.proportionFix, measure.width, measure.height]);

  const onHeightChange = (e: KeyboardEvent<HTMLInputElement>) => { // Обработчик изменения высоты
    const value = parseInt((e.target as HTMLInputElement).value); // Получение значения из события
    if (isNaN(value)) { // Проверка на NaN
      return; // Возврат
    }
    if (measure.proportionFix) { // Проверка сохранения пропорций
      const proportion = value / measure.height; // Расчет пропорции
      setMeasure({...measure, height: value, width: Math.round(measure.width * proportion) || 1 }); // Установка новых размеров с сохранением пропорций
    } else {
      setMeasure({...measure, height: value}) // Установка новой высоты без сохранения пропорций
    }
  }

  const onWidthChange = (e: KeyboardEvent<HTMLInputElement>) => { // Обработчик изменения ширины
    const value = parseInt((e.target as HTMLInputElement).value); // Получение значения из события
    if (isNaN(value)) { // Проверка на NaN
      return; // Возврат
    }
    if (measure.proportionFix) { // Проверка сохранения пропорций
      const proportion = value / measure.width; // Расчет пропорции
      setMeasure({...measure, width: value, height: Math.round(measure.height * proportion) || 1 }); // Установка новых размеров с сохранением пропорций
    } else {
      setMeasure({...measure, width: value}) // Установка новой ширины без сохранения пропорций
    }
  }

  const onPHeightChange = (e: KeyboardEvent<HTMLInputElement>) => { // Обработчик изменения процента высоты
    const value = parseInt((e.target as HTMLInputElement).value); // Получение значения из события
    if (isNaN(value)) { // Проверка на NaN
      return; // Возврат
    }
    const proportion = value / measure.pHeight; // Расчет пропорции
    if (measure.proportionFix) { // Проверка сохранения пропорций
      setMeasure({...measure, pHeight: value, pWidth: Math.round(measure.pWidth * proportion) || 1}); // Установка новых размеров с сохранением пропорций
    } else {
      setMeasure({...measure, pHeight: value}) // Установка нового процента высоты без сохранения пропорций
    }
  }

  const onPWidthChange = (e: KeyboardEvent<HTMLInputElement>) => { // Обработчик изменения процента ширины
    const value = parseInt((e.target as HTMLInputElement).value); // Получение значения из события
    if (isNaN(value)) { // Проверка на NaN
      return; // Возврат
    }
    const proportion = value / measure.pWidth; // Расчет пропорции
    if (measure.proportionFix) { // Проверка сохранения пропорций
      setMeasure({...measure, pWidth: value, pHeight: Math.round(measure.pHeight * proportion) || 1}); // Установка новых размеров с сохранением пропорций
    } else {
      setMeasure({...measure, pWidth: value}) // Установка нового процента ширины без сохранения пропорций
    }
  }

  const calcWidthHeight = () => { // Функция для расчета ширины и высоты
    if (measure.type === 'pixels') { // Проверка типа единиц измерения
      return [measure.width, measure.height]; // Возврат размеров в пикселях
    } else { // Иначе
      return [Math.round(measure.width * measure.pWidth / 100), Math.round(measure.height * measure.pHeight / 100)]; // Возврат размеров в процентах
    }
  }

  return (
    <Flex vertical gap="large"> 
      <Flex gap='middle' align='end'> 
        <Space direction='vertical'> 
        <p>Текущее количество пикселей: {(width * height) / 1000000} мегапикселей</p>
        <p>Новое количество пикселей: {(width * height) / 1000000} мегапикселей</p>
          <Space> 
            Высота
            { measure.type === 'pixels' // Проверка типа единиц измерения
              ?
              <InputNumber 
              placeholder='height' 
              min={ 1 }
              maxLength={ 4 }
              value={ measure.height }
              onPressEnter={ onHeightChange } 
            />
            : // Если тип измерения - пиксели, отображается InputNumber для ввода высоты в пикселях
            <InputNumber 
              placeholder='height' 
              min={ 1 }
              max={ 1000 }
              value={ measure.pHeight }
              onPressEnter={ onPHeightChange } 
            /> // Если тип измерения - проценты, отображается InputNumber для ввода высоты в процентах
          }
        </Space>
        <Space>
          <Checkbox 
            onClick={ () => setMeasure({...measure, proportionFix: !measure.proportionFix}) }
          >
            Сохранять пропорции
          </Checkbox>
        </Space>
        <Space>
          Ширина 
          { measure.type === 'pixels' // Проверка типа единиц измерения
            ?
            <InputNumber 
              placeholder='width' 
              min={ 1 }
              maxLength={ 4 }
              value={ measure.width } 
              onPressEnter={ onWidthChange }
            /> // Если тип измерения - пиксели, отображается InputNumber для ввода ширины в пикселях
            :
            <InputNumber 
              placeholder='width' 
              min={ 1 }
              max={ 1000 }
              value={ measure.pWidth } 
              onPressEnter={ onPWidthChange }
            /> // Если тип измерения - проценты, отображается InputNumber для ввода ширины в процентах
          }
        </Space>
      </Space>
      <Select
        defaultValue="pixels"
        onChange={ (value) => setMeasure({...measure, type: value}) }
        options={[
          { value: 'pixels', label: 'px' },
          { value: 'percentage', label: '%' },
        ]}
      />
    </Flex>
    <Space>
      Алгоритм интерполяции
      <Select 
        defaultValue="closestNeighbour"
        onChange={ (value) => setAlgorithm(value) }
        options={[
          { value: 'closestNeighbour', label: 'Ближайший сосед'}
        ]}
      />
    </Space>
    <Space>
      <Button type='link' onClick={ () => onChangeSizeSubmit(calcWidthHeight()[0], calcWidthHeight()[1]) }>
        Изменить
      </Button>
    </Space>
  </Flex>
)
}

export default ChangeSizeModal; // Экспорт компонента ChangeSizeModal
