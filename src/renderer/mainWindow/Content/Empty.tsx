import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { useStore } from '../../contextProvider/storeContext';
import CodeIcon from '../../../../assets/images/code.png';
import './Content.scss';

const Empty = () => {
  const store = useStore();
  const [other, setOther] = useState('');

  useEffect(() => {
    const tips = [
      'Ctrl + Shift + V 可以呼出快捷窗口',
      '有问题发送到xiangfeitian@pm.me',
      '我能吞下玻璃而不伤身体',
      'Talk is cheap. Show me the code.',
    ];
    const changeTip = () => {
      setOther(tips[Math.floor(Math.random() * tips.length)]);
    };

    const timer = setInterval(changeTip, 4000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="empty">
      <div className="tip">
        <img src={CodeIcon} alt="" />
        <p>所有片段</p>
        <small>一共有{store?.snippetsStore.snippets.length}条</small>
        <p className="other">{other}</p>
      </div>
    </div>
  );
};

export default observer(Empty);
