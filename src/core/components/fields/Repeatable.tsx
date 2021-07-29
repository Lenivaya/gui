import React, { useState, useEffect } from 'react';
import { FC } from 'react';

const withRepeatable =
  (Field) =>
  ({
    options,
    handleRepeatableChange,
    handleRepeatableAdd,
    handleRepeatableRemove,
  }) => {
    const [fieldsCount, setFieldsCount] = useState(
      Object.keys(options.value).length,
    );

    const handleAddButtonPress = (key: number) => (e) => {
      setFieldsCount(fieldsCount + 1);

      handleRepeatableAdd(key);
    };

    const handleRemoveButtonPress =
      (key: number) => (e) => {
        /* setFieldsCount(fieldsCount - 1); */

        handleRepeatableRemove(key);
      };

    return (
      <div className="flex flex-col space-y-2">
        {[...Array(fieldsCount).keys()].map((i) => {
          return (
            <div key={`field-${i}`}>
              {Object.keys(options.value).includes(
                `${i}`,
              ) && (
                <div className="flex flex-row rounded-lg bg-transparent space-x-1">
                  <Field
                    options={options}
                    handleChange={handleRepeatableChange(i)}
                    repeatableValue={options.value[i]}
                  />

                  <Button
                    symbol="-"
                    clickHandler={handleRemoveButtonPress(
                      i,
                    )}
                    showPredicate={
                      i !== 0 || fieldsCount > 1
                    }
                  />

                  <Button
                    symbol="+"
                    clickHandler={handleAddButtonPress(i)}
                    showPredicate={i === fieldsCount - 1}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

const buttonStyle =
  'bg-gray-100 text-gray-600 hover:text-malibu-700 w-8 rounded-r cursor-pointer';

interface ButtonProps {
  symbol: string;
  clickHandler: (evt: any) => void;
  showPredicate: boolean;
}

const Button: FC<ButtonProps> = ({
  symbol,
  clickHandler,
  showPredicate,
}) => {
  return (
    <>
      {showPredicate && (
        <button
          className={buttonStyle}
          onClick={clickHandler}
        >
          <span className="m-auto text-sm font-thin">
            {symbol}
          </span>
        </button>
      )}
    </>
  );
};

export default withRepeatable;