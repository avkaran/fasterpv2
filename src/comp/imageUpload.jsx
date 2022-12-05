import React, { useState, useEffect, useContext } from 'react';
import { Upload, message, Image, Space } from 'antd';
import PsContext from '../context';
import { LoadingOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import './style.css'
const ImageUpload = (props) => {
    const context = useContext(PsContext);
    //type=add or edit
    const { storeFileName, defaultImage, onFinish, cropRatio,isAddOnly, ...other } = props;
    const [imgLoading, setImgLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState();
    useEffect(() => {

    }, []);
    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };
    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';

        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }

        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        UploadFile(file);
        return isJpgOrPng && isLt2M;
    };
    const handleFileChange = (info) => {
       /*  if (info.file.status === 'uploading') {
            setImgLoading(true);
            setImageUrl(false);
            return;
        } */
    };
    const UploadFile = (file) => {
        getBase64(file, (data64) => {
            var form = new FormData();
            form.append('file_data', data64)
            form.append('file_name', file.name)
            form.append('store_file_name', storeFileName)
            context.psGlobal.apiRequest('v1/admin/upload-image', "prod", form).then((res, error) => {
                if (res) {
                    setImgLoading(false);
                    setImageUrl(context.baseUrl + storeFileName);
                    onFinish(storeFileName);
                }
                else {
                    message.error(error);

                }

            })
        });
    }
    const uploadButton = (
        <div>
            {imgLoading ?
                <LoadingOutlined />
                :
                defaultImage && defaultImage !== '' ?
                    <EditOutlined />
                    :
                    <PlusOutlined />
            }
            <div
                style={{
                    marginTop: 8,
                }}
            >
                {defaultImage && defaultImage !== '' ? 'Change' : 'Upload'}
            </div>
        </div>
    );
    return (
        <Space>
            {defaultImage && (<Image height={100} src={context.baseUrl + defaultImage} ></Image>)}
            {cropRatio && (<ImgCrop grid rotate aspect={parseInt(cropRatio.split("/")[0])/parseInt(cropRatio.split("/")[1])}><Upload
                {...other}
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}

                action={(file) => {
                  //  UploadFile(file)

                }}
                beforeUpload={beforeUpload}
                onChange={handleFileChange}
            >
                {imageUrl && !isAddOnly ? (
                    <img
                        src={imageUrl}
                        alt="avatar"
                        style={{
                            width: '100%',
                        }}
                    />
                ) : (
                    uploadButton
                )}
            </Upload></ImgCrop>)
            }
            {
                !cropRatio && (<Upload
                    {...other}
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
    
                    action={(file) => {
                      //  UploadFile(file)
    
                    }}
                    beforeUpload={beforeUpload}
                    onChange={handleFileChange}
                >
                    {imageUrl  && !isAddOnly  ? (
                        <img
                            src={imageUrl}
                            alt="avatar"
                            style={{
                                width: '100%',
                            }}
                        />
                    ) : (
                        uploadButton
                    )}
                </Upload>)
            }
        </Space>
    );
}
export {
    ImageUpload,
} 