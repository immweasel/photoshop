// Импорт типов для свойств вкладок из библиотеки Ant Design
import type { TabsProps } from 'antd';

// Импорт компонентов для загрузки файлов и URL
import FileUpload from '../pages/FileUpload/FileUpload';
import URLUpload from '../pages/URLUpload/URLUpload';

const tabsItemsOnFunc = (func: Function) => {
  // Определение массива элементов вкладок
  const tabsItems: TabsProps['items'] = [
    {
      key: '1', // Уникальный ключ для первой вкладки
      label: 'Загрузка по файлу', // Метка для первой вкладки
      // Компонент для загрузки файлов, с передачей функции обратного вызова
      children: <FileUpload onSuccessUpload={(file) => { func(file) }}/>,
    },
    {
      key: '2', // Уникальный ключ для второй вкладки
      label: 'Загрузка по URL', // Метка для второй вкладки
      // Компонент для загрузки по URL, с передачей функции обратного вызова
      children: <URLUpload onSuccessUpload={(file) => { func(file) }}/>,
    },
  ];
  return tabsItems; // Возвращение массива элементов вкладок
}

// Экспорт функции по умолчанию
export default tabsItemsOnFunc;