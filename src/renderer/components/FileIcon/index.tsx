import Icons from '@uiw/file-icons/fonts/ffont.symbol.svg';
import { mapLanguage } from './icons';

interface IFileIconProps {
  lang: string;
}

const FileIcon = ({ lang }: IFileIconProps) => {
  return (
    <svg className="file-icon" aria-hidden="true">
      <use xlinkHref={`${Icons}#ffont-${mapLanguage(lang)}`} />
    </svg>
  );
};

export default FileIcon;
