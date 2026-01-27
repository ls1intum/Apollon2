import 'global-jsdom/register';
import type { SVG, UMLModel,  } from '@tumaet/apollon';
import { ApollonEditor } from '@tumaet/apollon';

// Use the CJS entry to avoid ESM default-export interop issues in Node.

export class ConversionService {
  convertToSvg = async (model: UMLModel): Promise<SVG> => {
    document.body.innerHTML = '<!doctype html><html lang="en"><body><div></div></body></html>';
    // JSDOM does not implement getBBox; mock it to allow SVG export.
    // @ts-ignore - JSDOM does not implement getBBox.
    window.SVGElement.prototype.getBBox = () => ({
      x: 0,
      y: 0,
      width: 10,
      height: 10,
    });
    const container = document.querySelector('div')!;
    const editor = new ApollonEditor(container, {});
    editor.model = model;
    return editor.exportAsSVG();
  };
}
