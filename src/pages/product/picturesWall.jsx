import React from 'react';
import { Upload, Icon, Modal, message } from 'antd';
import { reqDeleteImg } from '../../api/index';
import PropTypes from 'prop-types';
import { BASE_IMG_URL } from '../../utils/constants';

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
/**
 * 用于图片上传的组件
 */
export default class PicturesWall extends React.Component {

    static propTypes = {
        imgs: PropTypes.array
    }

    constructor(props) {
        super(props);
        let fileList = [];
        if(this.props.imgs && this.props.imgs.length > 0){
            fileList = this.props.imgs.map((img, index) =>(
                {
                    uid: -index, // 每个file都有自己唯一的ID
                    name: img, // 图片文件名
                    status: 'done', // 图片状态：down-已上传，uploading-正在上传中，error-上传错误，removed-已删除
                    url: BASE_IMG_URL + img
                }
            ))
        }
        this.state = {
            previewVisible: false, // 标识是否显示大图预览Modal
            previewImage: '', // 大图的url
            fileList
            // fileList: [
            //     {
            //         uid: '-1', // 每个file都有自己唯一的ID
            //         name: 'image.png', // 图片文件名
            //         status: 'done', // 图片状态：down-已上传，uploading-正在上传中，error-上传错误，removed-已删除
            //         url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png', // 图片地址
            //     }
            // ],
        };
    }

    // 获取所有已上传图片文件名的数组
    getImgs = () => {
        return this.state.fileList.map(file => file.name);
    }

    // 隐藏Modal
    handleCancel = () => this.setState({ previewVisible: false });

    // 预览
    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };

    /**
     * file：当前操作的图片文件（上传/删除）
     * fileList:所有上传图片文件对象的数组
     */
    handleChange = async ({ file, fileList }) => {
        // 一旦上传成功，将当前上传的file的信息修正
        if (file.status === 'done') {
            const result = file.response;
            if (result.status === 0) {
                message.success('上传图片成功');
                const { name, url } = result.data;
                fileList[fileList.length - 1].name = name;
                fileList[fileList.length - 1].url = url;
            } else {
                message.error('上传图片失败');
            }
        } else if (file.status === 'removed') {
            const result = await reqDeleteImg(file.name);
            if (result.status === 0) {
                message.success('删除图片成功');
            } else {
                message.error('删除图片失败');
            }
        }
        // 在操作(上传/删除)过程中更新fileList状态
        this.setState({ fileList })
    };

    render() {
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div>Upload</div>
            </div>
        );
        return (
            <div>
                <Upload
                    action="/manage/img/upload" // 图片上传的地址
                    accept='image/*' // 接收文件类型,只接收图片格式
                    name='image' // 图片上传时请求参数的名字
                    listType="picture-card"
                    fileList={fileList} // 用来指定所有已上传文件的列表
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 3 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}
