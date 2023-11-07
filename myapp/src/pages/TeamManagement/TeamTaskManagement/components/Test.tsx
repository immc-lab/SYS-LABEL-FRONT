import { Button } from 'antd';
import React, { useState } from 'react';

const Breadcrumb = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [history, setHistory] = useState([]);

  const handleClick = (index) => {
    if (index === activeIndex) return;
    if (index < activeIndex) {
      setHistory((prevHistory) => prevHistory.slice(0, index + 1));
    } else {
      setHistory((prevHistory) => [...prevHistory.slice(0, index), ...items.slice(index)]);
    }
    setActiveIndex(index);
  };

  const handleBack = () => {
    if (activeIndex === 0) return;
    setActiveIndex((prevIndex) => prevIndex - 1);
  };

  const handleForward = () => {
    if (activeIndex === history.length - 1) return;
    setActiveIndex((prevIndex) => prevIndex + 1);
  };

  return (
    <div className="breadcrumb">
      {history.map((item, index) => (
        <span
          key={index}
          className={`breadcrumb-item ${index === activeIndex ? 'active' : ''}`}
          onClick={() => handleClick(index)}
        >
          {item}
        </span>
      ))}
      <Button onClick={handleBack}>后退</Button>
      <Button onClick={handleForward}>前进</Button>
    </div>
  );
};

const Test = () => {
  const items = ['首页', '产品', '电子产品'];

  return (
    <div className="App">
      <Breadcrumb items={items} />
    </div>
  );
};

export default Test;
