import { Input, Form, Button } from 'antd'; // Импорт компонентов из Ant Design и библиотеки axios
import axios from 'axios';
import './URLUpload.css' // Импорт стилей компонента URLUpload

export interface URLUploadProps { // Интерфейс свойств компонента URLUpload
  onSuccessUpload: (file: File) => void // Функция обратного вызова, вызываемая при успешной загрузке файла
}

type FieldType = {
  url: string; // Тип поля для ввода URL
};

const URLUpload = ({ // Определение компонента URLUpload
  onSuccessUpload
}: URLUploadProps) => {
  return (
    <Form // Форма для загрузки файла по URL
      className='url-form' // Класс формы
      name='urlUpload' // Имя формы
      onFinish={(values) => { // Обработчик отправки формы
        axios // Выполнение запроса к URL с помощью axios
          .get(values.url, { // Выполнение GET-запроса к URL
            responseType: 'blob' // Определение типа ответа как blob (двоичный файл)
          })
          .then(res => onSuccessUpload(new File( // Обработка успешного ответа
            [res.data], // Данные из ответа
            values.url.slice( // Извлечение имени файла из URL
              values.url.lastIndexOf('/') + 1, // Начало имени файла
              values.url.indexOf('.'), // Конец имени файла
              { type: res.headers['content-type'] } // Тип файла из заголовков ответа
            )))) // Создание объекта File из данных и имени файла
          .catch(err => console.log(err)) // Обработка ошибок
      }}
    >
      <Form.Item<FieldType> // Поле ввода URL
        className='url-input' // Класс поля ввода
        name="url" // Имя поля
      >
        <Input placeholder="Введите URL" />
      </Form.Item>
      <Form.Item>
        <Button type="dashed" htmlType="submit">
          Подтвердить
        </Button>
      </Form.Item>
    </Form>
  )
}

export default URLUpload; // Экспорт компонента URLUpload
