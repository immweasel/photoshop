import { InboxOutlined } from '@ant-design/icons'; // Импорт иконки для компонента загрузки
import type { UploadProps } from 'antd'; // Импорт типа свойств компонента загрузки из Ant Design
import { UploadRequestOption } from 'rc-upload/lib/interface'; // Импорт интерфейса опций запроса загрузки из rc-upload
import { message, Upload } from 'antd'; // Импорт сообщений и компонента загрузки из Ant Design
import './FileUpload.css'; // Импорт стилей компонента загрузки

const { Dragger } = Upload; // Деструктуризация компонента Dragger из компонента Upload

const props: UploadProps = { // Определение свойств компонента загрузки
  name: 'file', // Имя поля для загружаемого файла
  multiple: true, // Разрешение на загрузку нескольких файлов
  action: '', // URL-адрес для обработки запроса загрузки (в нашем случае пустой)
  onChange(info) { // Обработчик события изменения состояния загрузки файла
    const { status } = info.file; // Получение статуса загруженного файла
    if (status !== 'uploading') { // Если файл не находится в процессе загрузки
      console.log(info.file, info.fileList); // Вывод информации о файле в консоль
    }
    if (status === 'done') { // Если загрузка файла завершена успешно
      message.success(`${info.file.name} file uploaded successfully.`); // Вывод сообщения об успешной загрузке
    } else if (status === 'error') { // Если произошла ошибка при загрузке файла
      message.error(`${info.file.name} file upload failed.`); // Вывод сообщения об ошибке загрузки
    }
  },
  onDrop(e) { // Обработчик события "drop" (бросания) файлов в область загрузки
    console.log('Dropped files', e.dataTransfer.files); // Вывод информации о выбранных файлах в консоль
  },
};

export interface FileUploadProps { // Интерфейс свойств компонента FileUpload
  onSuccessUpload: (file: any) => void // Функция обратного вызова, вызываемая при успешной загрузке файла
}

const FileUpload = ({ // Определение компонента загрузки файлов
  onSuccessUpload
}: FileUploadProps) => {
  const handleUpload = (options: UploadRequestOption) => { // Функция для обработки загрузки файла
    onSuccessUpload(options.file); // Вызов функции обратного вызова при успешной загрузке файла
  }

  return ( // Возвращение компонента Dragger для загрузки файлов
    <Dragger 
      accept="image/*" // Разрешение на загрузку файлов только типа image
      showUploadList={ false } // Скрытие списка загружаемых файлов
      customRequest={ (options) => handleUpload(options) } // Пользовательская обработка запроса загрузки файла
      maxCount={ 1 } {...props} // Ограничение на количество загружаемых файлов (в нашем случае 1) и передача свойств компонента загрузки
    >
      <p className="ant-upload-drag-icon"> 
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">Нажмите или перенесите файл для загрузки</p> 
      <p className="ant-upload-hint">
      Поддержка одной загрузки. Строго запрещено загружать данные компании или другие запрещенные файлы.
      </p>
    </Dragger>
  )
};

export default FileUpload; // Экспорт компонента FileUpload для использования в других частях приложения
