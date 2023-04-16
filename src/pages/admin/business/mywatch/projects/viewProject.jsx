import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Row, message } from 'antd';
import { Form, Radio } from 'antd';
import { Layout, Spin } from 'antd';
import PsContext from '../../../../../context';
import ResponsiveLayout from '../../../layout';
import ProjectConstraints from './ProjectConstraints';
import ReactCodeGenerator from './reactCoder';
import TableDataReformat from './tableDataReformat';
import PhpApiCoder from './phpApiCoder';
import AiSample from './aiSample';
const ViewProject = (props) => {
    const context = useContext(PsContext);
    const { Content } = Layout;
    const navigate = useNavigate();
    const { userId, projectId } = useParams()
    const [addForm] = Form.useForm();
    const [loader, setLoader] = useState(false);
    const [curAction, setCurAction] = useState('constraints');
    const [viewData, setviewData] = useState(null);
    const [curTab, setCurTab] = useState('constraints')

    useEffect(() => {
        loadViewData(projectId);
    }, []);
    const loadViewData = (id) => {
        setLoader(true);
        var reqData = {
            query_type: 'query',
            query: "select * from projects where status=1 and id=" + id
        };
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            setviewData(res[0]);
            // LoadTables(res[0])
            setLoader(false);

        }).catch(err => {
            message.error(err);
            setLoader(false);

        })
    }
    return (
        <> <ResponsiveLayout

            userId={userId}
            customHeader={null}
            bottomMenues={null}
            breadcrumbs={[
                { name: 'Manage Project', link: null },
                { name: viewData && viewData.project_name, link: null },
            ]}
        >
            <Spin spinning={loader} >
                {
                    viewData && (<>
                        <Row>
                            <Radio.Group defaultValue="constraints" buttonStyle="solid" onChange={(e) => setCurTab(e.target.value)} >
                                <Radio.Button value="database">Database</Radio.Button>
                                <Radio.Button value="constraints">Constraints</Radio.Button>
                                <Radio.Button value="react-coder"> React Coder</Radio.Button>
                                <Radio.Button value="php-api-coder"> PHP Api Coder</Radio.Button>
                                <Radio.Button value="data-re-format"> Data Import/Data Reformat</Radio.Button>
                                <Radio.Button value="ai-sample"> AI Sample</Radio.Button>
                            </Radio.Group>
                        </Row>
                        {
                            viewData && curTab==='constraints' && (<ProjectConstraints userId={userId} projectId={viewData.id} />)
                        }


                        {
                            viewData && curTab==='react-coder' && (<ReactCodeGenerator userId={userId} projectId={viewData.id} />)
                        }
                         {
                            viewData && curTab==='data-re-format' && (<TableDataReformat userId={userId} projectId={viewData.id} />)
                        }
                          {
                            viewData && curTab==='php-api-coder' && (<PhpApiCoder userId={userId} projectId={viewData.id} />)
                        }
                          {
                            viewData && curTab==='ai-sample' && (<AiSample userId={userId} projectId={viewData.id} />)
                        }
                    </>)
                }

            </Spin>
        </ResponsiveLayout>

        </>
    );

}
export default ViewProject;