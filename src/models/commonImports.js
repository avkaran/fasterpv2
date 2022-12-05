const commonImports = [
    {
        name: "context",
        importStatement: `
        import PsContext from '../../../../../context';`,
        declarations:`
        const context = useContext(PsContext);`,
    },
    {
        name: "history",
        importStatement: `
        import { useNavigate } from 'react-router-dom';`,
        declarations:`
        const navigate = useNavigate();`,
    },
    {
        name: "fontawesome",
        importStatement: `
        import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
        import { faFilter } from '@fortawesome/free-solid-svg-icons';`,
        declarations:``,
    },
    {
        name: "ant-colors",
        importStatement: `
        import { green, blue, red, cyan, grey,volcano,orange,gold,yellow,lime,geekblue,purple,magenta,grey } from '@ant-design/colors';`,
        declarations:``,
    },
    {
        name: "antd",
        importStatement: ``,
        declarations:`
        import { Row, Col, message,Card,Space,Spin} from 'antd';`,
    },
    {
        name: "country-state",
        importStatement: `
        import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';`,
        declarations:`
        const [country, setCountry] = useState('');`,
    },
    {
        name: "mycomp",
        importStatement: `
        import {MyButton,DeleteButton,ImageUpload,MyCodeBlock} from '../../../../../comp'`,
        declarations:``,
    },
    {
        name: "phone-input",
        importStatement: `
        import PhoneInput from 'react-phone-input-2'
        import 'react-phone-input-2/lib/style.css'`,
        declarations:``,
    },
]