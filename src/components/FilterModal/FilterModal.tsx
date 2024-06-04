import { useEffect, useRef, useState } from 'react';
import { InputNumber, Button, Checkbox, Select } from 'antd';
import getCanvasNCtx from '../../utils/getCanvasNCtx';
import './FilterModal.css';
import makeImageMatrix from '../../utils/makeImageMatrix';
import edgeMatrixPrepare from '../../utils/edgesMatrixPrepare';

export interface FilterModalProps {
  imageRef: React.RefObject<HTMLCanvasElement>;
  onFilterChange: (data: string) => void;
  closeModal: () => void;
}

const FilterModal = ({
  imageRef,
  onFilterChange,
  closeModal,
}: FilterModalProps) => {
  const previewRef = useRef<HTMLCanvasElement>(null);
  const [filterValues, setFilterValues] = useState<number[]>([
    0, 0, 0, 0, 1, 0, 0, 0, 0,
  ]);
  const [isPreview, setIsPreview] = useState(false);
  const [filterPreset, setFilterPreset] = useState('base');

  useEffect(() => {
    if (isPreview) {
      renderPreview();
    }
  }, [isPreview]);

  useEffect(() => {
    if (isPreview) {
      renderPreview();
    }
  }, [filterValues]);

  useEffect(() => {
    switch (filterPreset) {
      case 'base':
        setFilterValues([0, 0, 0, 0, 1, 0, 0, 0, 0]);
        break;
      case 'raise':
        setFilterValues([0, -1, 0, -1, 5, -1, 0, -1, 0]);
        break;
      case 'gauss':
        setFilterValues([1, 2, 1, 2, 4, 2, 1, 2, 1]);
        break;
      case 'rect':
        setFilterValues([1, 1, 1, 1, 1, 1, 1, 1, 1]);
        break;
      default:
        setFilterValues([0, 0, 0, 0, 1, 0, 0, 0, 0]);
        break;
    }
  }, [filterPreset]);

  const resetValues = () => {
    setFilterPreset('base');
    setFilterValues([0, 0, 0, 0, 1, 0, 0, 0, 0]);
  };

  const filterOptions = [
    { value: 'base', label: 'Тождественное отображение' },
    { value: 'raise', label: 'Повышение резкости' },
    { value: 'gauss', label: 'Фильтр Гаусса' },
    { value: 'rect', label: 'Прямоугольное размытие' },
  ];

  const onFilterOptionsChange = (value: string) => {
    setFilterPreset(value);
  };

  const onFilterInputChange = (value: number | null, index: number) => {
    if (value !== null) {
      const newValues = [...filterValues];
      newValues[index] = value;
      setFilterValues(newValues);
    }
  };

  const arrayToMatrix = (array: number[]) => {
    let matrix = [
      [...array.slice(0, 3)],
      [...array.slice(3, 6)],
      [...array.slice(6, 9)],
    ];
    if (JSON.stringify(array) === JSON.stringify([1, 2, 1, 2, 4, 2, 1, 2, 1])) {
      matrix = matrix.map((el) => el.map((e) => e / 16));
    }
    if (JSON.stringify(array) === JSON.stringify([1, 1, 1, 1, 1, 1, 1, 1, 1])) {
      matrix = matrix.map((el) => el.map((e) => e / 9));
    }
    return matrix;
  };

  const makeFilteredData = () => {
    const [canvas, ctx] = getCanvasNCtx(imageRef);
    const canvasImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const srcData = canvasImageData.data;

    const [previewCanvas, _] = getCanvasNCtx(previewRef);

    previewCanvas.height = canvas.height;
    previewCanvas.width = canvas.width;

    const newImageData = new Uint8ClampedArray(
      canvasImageData.width * canvasImageData.height * 4
    );

    console.log(filterValues);
    let kernel = arrayToMatrix(filterValues);
    console.log(kernel);
    const height = canvasImageData.height;
    const width = canvasImageData.width;

    let imageMatrix = makeImageMatrix(srcData, width);
    imageMatrix = edgeMatrixPrepare(imageMatrix, width, height);

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let R = 0;
        let G = 0;
        let B = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            let pixelPos = (y + ky) * width + (x + kx) * 4;
            let weight = kernel[ky + 1][kx + 1];
            R += srcData[pixelPos] * weight;
            G += srcData[pixelPos + 1] * weight;
            B += srcData[pixelPos + 2] * weight;
          }
        }
        let pos = (y * width + x) * 4;
        newImageData[pos] = R;
        newImageData[pos + 1] = G;
        newImageData[pos + 2] = B;
        newImageData[pos + 3] = 255;
      }
    }

    const tempImageData = new ImageData(newImageData, canvas.width, canvas.height);

    return tempImageData;
  };

  const renderPreview = () => {
    const [_, previewCtx] = getCanvasNCtx(previewRef);
    const tempImageData = makeFilteredData();
    previewCtx.putImageData(tempImageData, 0, 0);
  };

  const applyFiltration = () => {
    const [previewCanvas, _] = getCanvasNCtx(previewRef);
    renderPreview();
    onFilterChange(previewCanvas.toDataURL());
  };

  const handlePreview = () => {
    setIsPreview(!isPreview);
  };

  return (
    <div className='filter-modal'>
      <Select
        className='filter-options'
        defaultValue='base'
        value={filterPreset}
        onChange={(value) => onFilterOptionsChange(value)}
        options={filterOptions}
      />
      <div className="filter-inputs">
        {filterValues.map((value, index) => (
          <InputNumber
            key={index}
            value={value}
            onChange={(value) => onFilterInputChange(value, index)}
            className='filter-input'
          />
        ))}
      </div>
      <div className="preview-container">
        <canvas
          ref={previewRef}
          className='preview'
          style={{
            height: !isPreview ? 0 : '',
          }}
        />
      </div>
      <div className="filter-btns">
        <Button
          type='primary'
          onClick={() => {
            applyFiltration();
            closeModal();
          }}
        >
          Изменить
        </Button>
        <Checkbox checked={isPreview} onClick={handlePreview}>
          Предпросмотр
        </Checkbox>
        <Button onClick={resetValues}>Сбросить</Button>
      </div>
    </div>
  );
};

export default FilterModal;