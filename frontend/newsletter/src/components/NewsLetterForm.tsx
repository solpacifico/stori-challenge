import React, { useState } from 'react';
import { NewsLetterFormProps } from '../models/NewsLetterFormProps';
import { Button, Flex, FloatButton, Form, Input, InputNumber, Row, Space, Upload, UploadProps } from 'antd';
import { CheckCircleOutlined , UploadOutlined,CloseCircleOutlined } from '@ant-design/icons';
import { PickerOverlay } from 'filestack-react';
import { FileInfo } from '../types/FileInfo';
import { NewsLetter } from '../types/NewsLetter';
import { RecipientList } from './RecipientList';
import { Recipient } from '../types/Recipient';
import {ScheduleForm} from './ScheduleForm';
import { ScheduleFormProps } from '../models/ScheduleFormProps';
import { Schedule } from '../types/Sechedule';



export function  NewsLetterForm (props:NewsLetterFormProps){

    const API_KEY = "AhFvrvtZjQHWp15rPmsQNz";

    const [AttachOverlay,setattachOverlay] = useState(false);
    
    const [FileObject, setFileObject] = useState<FileInfo>();

    const [showScheduler, setShowScheduler] = useState(false);

    const [form] = Form.useForm();

  
   

    
    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
      };
      
    /* eslint-disable no-template-curly-in-string */
    const validateMessages = {
        required: '${label} is required!',
        types: {
            email: '${label} is not a valid email!',
            number: '${label} is not a valid number!',
        },
        number: {
            range: '${label} must be between ${min} and ${max}',
        },
        };
        /* eslint-enable no-template-curly-in-string */
        
    const onFinish = (values: any) => {
      console.log(values);
    };

    const cancelHandler = () =>{
        props.handleReturnToList && props.handleReturnToList();
    }

    const handleDeleteEmail = (id: number): void =>{
      props.handleDeleteEmail && props.handleDeleteEmail(id);      
    }

    const handleShowScheduler = () =>{
      setShowScheduler(!showScheduler);
    }

    const saveHandler = () =>{
      
      const vals = form.getFieldsValue();
      //console.log(props.NewsLetterDTO);
      console.log(vals);
      const objToSave:NewsLetter ={
        id:props.NewNewsLetter?0:props.NewsLetterDTO?.id ?? 0,
        name:vals.NewNL.Name?vals.NewNL.Name:props.NewsLetterDTO?.name,
        description:vals.NewNL.Description?vals.NewNL.Description:props.NewsLetterDTO?.description,
        template:vals.NewNL.Template?vals.NewNL.Template:props.NewsLetterDTO?.template,
        attachment:JSON.stringify(FileObject),
        customer:vals.NewNL.Customer?vals.NewNL.Customer:props.NewsLetterDTO?.customer,
        recipients:[]
      };
      props.handleToSave && props.handleToSave(objToSave);

    }
    
    const showAttacmentOverlay = () =>{
      setattachOverlay(!AttachOverlay);
      
    }

    const FileUploadDone = (res:any) =>{
      console.log(res)
      console.log(AttachOverlay);    
      setFileObject(
        {
          filename:res?.filesUploaded[0]?.filename,
          handle:res?.filesUploaded[0]?.handle,
          mimetype:res?.filesUploaded[0]?.mimetype,
          url: res?.filesUploaded[0]?.url,
        }
      );

      setattachOverlay(false);
    }
      
    const getFilenameValue = (fileObject:any) =>{
      return fileObject?.filename;
    }
      
      const NLForm: React.FC = () => (
        <Form form={form}
          {...layout}
          name="nest-messages"
          onFinish={onFinish}
          style={{ maxWidth: 600 }}
          validateMessages={validateMessages}
        >
          <Form.Item name={['NewNL', 'Name']} label="Name" rules={[{ required: true }]}>
            <Input defaultValue={props.NewsLetterDTO?.name} />
          </Form.Item>
          <Form.Item name={['NewNL', 'Description']} label="Description">
            <Input.TextArea defaultValue={props.NewsLetterDTO?.description}/>
          </Form.Item>
          <Form.Item name={['NewNL', 'Template']} label="Template" >
            <Input.TextArea defaultValue={props.NewsLetterDTO?.template}/>
          </Form.Item>          
          <Form.Item name={['NewNL', 'Customer']} label="Customer">
            <Input defaultValue={props.NewsLetterDTO?.customer}/>            
          </Form.Item>
          
          <Form.Item name={['NewNL', 'Attachment']} label="Attachment">
            <Space.Compact style={{ width: '100%' }}>
              <Input value={getFilenameValue(FileObject)} />
              <Button type='primary'
                onClick={showAttacmentOverlay}
              >Upload File</Button>
            </Space.Compact>
          </Form.Item>
        
          
          {/* <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item> */}
        </Form>      
               
      );
    
      
    const handleAddToEmailList =(recipientList:Recipient[]) =>{
      
      props.handleAddToEmailList &&  props.handleAddToEmailList(recipientList);
    }

    const handleScheduleSubmit = (values:Schedule)=>{
      props.handleScheduleSubmit && props.handleScheduleSubmit(values)
    }
      
    
    return(
        
      <div>
         <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <NLForm></NLForm>
          
            <RecipientList
              RecipientList={props.NewsLetterDTO?.recipients}
              handleAddToEmailList = {handleAddToEmailList}
              handleDeleteEmail={handleDeleteEmail}
            ></RecipientList>

            <Flex gap="small" wrap="wrap">                    
              <Button 
                onClick={handleShowScheduler}
                type="primary" 
                shape="round" 
                icon={<UploadOutlined />} 
                size="large" />            
            </Flex>

            {showScheduler?<ScheduleForm 
              onSubmitHandle={handleScheduleSubmit}
              ScheduleDTO={props?.ScheduleDTO}></ScheduleForm>:null}

           


        
        
        
        </Space>


        
        
        {AttachOverlay?
          <PickerOverlay 
              apikey={API_KEY}                
              onUploadDone={(res:any) => FileUploadDone(res)}  
          ></PickerOverlay>
        :null}

        <FloatButton.Group shape="circle" style={{ right: 24 }}>
            <FloatButton
              onClick={saveHandler}
              icon={<CheckCircleOutlined />}                
            />
            <FloatButton />
            <FloatButton.BackTop visibilityHeight={0} 
                onClick={cancelHandler}
                icon={<CloseCircleOutlined/>}/>
        </FloatButton.Group>





      </div>
   )

   


}