import TextItem from '../component/TextItem';
import OptionItem from '../component/OptionItem';
import SelectItem from '../component/SelectItem';
import Separator from '../component/Separator';
import FormInfo from '../component/FormInfo'

// 元素类型与表单项组件类型间的映射关系
const ItemTypeMapper = {
    'text': TextItem,
    'option': OptionItem,
    'list': SelectItem,
    'sep': Separator,
    'form': FormInfo
};

export default ItemTypeMapper;
