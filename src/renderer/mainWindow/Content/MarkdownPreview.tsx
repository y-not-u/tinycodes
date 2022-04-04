import useEventListener from '@use-it/event-listener';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import mila from 'markdown-it-link-attributes';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import { useEffect, useRef, useState } from 'react';
import './MarkdownPreview.scss';

interface IMarkdownPreview {
  value: string;
}

const MarkdownPreview = ({ value }: IMarkdownPreview) => {
  const [rendererHTML, setRendererHTML] = useState('');
  const previewRef = useRef(null);

  useEffect(() => {
    const md = new MarkdownIt({
      html: true,
      langPrefix: 'language-',
      highlight(str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return `<pre class="hljs"><code>${
              hljs.highlight(lang, str, true).value
            }</code></pre>`;
          } catch (err) {
            // eslint-disable-next-line no-console
            console.log(err);
          }
        }

        return `<pre class="hljs"><code>${MarkdownIt().utils.escapeHtml(
          str
        )}</code></pre>`;
      },
    });
    md.use(mila, {
      attrs: {
        class: 'external',
      },
    });
    const result = md.render(value);
    setRendererHTML(result);
  }, [value]);

  const openExternal = (e: Event) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('external')) {
      e.preventDefault();
      window.electron.shell.openExternal((target as HTMLAnchorElement).href);
    }
  };

  useEventListener(
    'click',
    (e) => {
      openExternal(e);
    },
    previewRef.current
  );

  return (
    <SimpleBar className="markdown-scrollbar">
      <div
        className="markdown-preview"
        ref={previewRef}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: rendererHTML }}
      />
    </SimpleBar>
  );
};

export default MarkdownPreview;
