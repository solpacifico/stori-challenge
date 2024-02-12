import React, { useMemo, useState } from 'react';
import { NewsLetterFormProps } from '../models/NewsLetterFormProps';
import { Button, Flex, FloatButton, Form, Input, InputNumber, Modal, NotificationArgsProps, Row, Space, Upload, UploadProps, notification } from 'antd';
import { CheckCircleOutlined , UploadOutlined,CloseCircleOutlined, ClockCircleOutlined, SendOutlined  } from '@ant-design/icons';
import { PickerOverlay } from 'filestack-react';
import { FileInfo } from '../types/FileInfo';
import { NewsLetter } from '../types/NewsLetter';
import { RecipientList } from './RecipientList';
import { Recipient } from '../types/Recipient';
import {ScheduleForm} from './ScheduleForm';
import { ScheduleFormProps } from '../models/ScheduleFormProps';
import { Schedule } from '../types/Sechedule';
import { createTypeReferenceDirectiveResolutionCache } from 'typescript';


const Context = React.createContext({ name: 'Default' });

export function  NewsLetterForm (props:NewsLetterFormProps){

    /**File Service Key */
    const API_KEY = "AhFvrvtZjQHWp15rPmsQNz";

    
    /**
     * State Hooks
     */
    const [AttachOverlay,setattachOverlay] = useState(false);    
    const [FileObject, setFileObject] = useState<FileInfo>();
    const [showScheduler, setShowScheduler] = useState(false);
    const [form] = Form.useForm();
    const [ShowEmailList,setShowEmailList] = useState(false);    
    const [confirmLoading, setConfirmLoading] = useState(false); 
   
    

   
   
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
    
    /**
     * Handlers and Beahaviors
     * 
     */    

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
        attachment:JSON.stringify(props.CurrentFileObject),
        customer:vals.NewNL.Customer?vals.NewNL.Customer:props.NewsLetterDTO?.customer,
        recipients:[]
      };
      props.handleToSave && props.handleToSave(objToSave);

    }
    
    const showAttacmentOverlay = () =>{
      setattachOverlay(!AttachOverlay);
      
      //openNotification("NewsLetter Saved");
    }

    const FileUploadDone = (res:any) =>{
      
      const fileObjToload:FileInfo =
        {
          filename:res?.filesUploaded[0]?.filename,
          handle:res?.filesUploaded[0]?.handle,
          mimetype:res?.filesUploaded[0]?.mimetype,
          url: res?.filesUploaded[0]?.url,
        }
      
      props.FileUploadDoneHandler && props.FileUploadDoneHandler(fileObjToload);
      setattachOverlay(false);
    }
      
    const getFilenameValue = (fileObject:FileInfo | undefined) =>{
      console.log(fileObject);
      return fileObject?.filename;
    }
      
     
    
      
    const handleAddToEmailList =(recipientList:Recipient[]) =>{
      
      props.handleAddToEmailList &&  props.handleAddToEmailList(recipientList);
    }

    const handleScheduleSubmit = (values:Schedule)=>{
      setShowScheduler(false);
      props.handleScheduleSubmit && props.handleScheduleSubmit(values)
    }

    const handleOk = () => {
      
      setConfirmLoading(true);
      setTimeout(() => {
          setShowEmailList(false);
        setConfirmLoading(false);
      }, 2000);
    };
    
    /**
     * Hide Emal List
     */
    const handleCancel = () => {
      
      setShowEmailList(false);
    };
    /**
     * Set state to show recipient list
     */
    const showEmailListHandler = () =>{
      setShowEmailList(true)
    }
    /**
     * Action Handler to send mails massively
     */
    const SendNewsLetterNowHandler =()  => {
      props.SendNewsLetterNOWHandler && props.SendNewsLetterNOWHandler(props.NewsLetterDTO?.id??0);
      //openNotification("Emails Sent");
    }

    /**
     * Functional component to Render the newletter form
     * @returns Functional Component 
     */
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
        <Form.Item name={['NewNL', 'Description']} label="Subject">
          <Input.TextArea defaultValue={props.NewsLetterDTO?.description}/>
        </Form.Item>
        <Form.Item name={['NewNL', 'Template']} label="Template" >
          <Input.TextArea defaultValue={props.NewsLetterDTO?.template} style={{ height:500}}/>
        </Form.Item>          
        <Form.Item name={['NewNL', 'Customer']} label="Customer">
          <Input defaultValue={props.NewsLetterDTO?.customer}/>            
        </Form.Item>
        
        <Form.Item name={['NewNL', 'Attachment']} label="Attachment">
          <Space.Compact style={{ width: '100%' }}>
            <Input defaultValue={getFilenameValue(props.CurrentFileObject)} />
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
      
    

    /**
     * Main Render
     */
    return(
     
      <div>
      
         <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <NLForm></NLForm>
            <Modal
              title="Recipient Email List"
              open={ShowEmailList}
              onOk={handleOk}
              confirmLoading={confirmLoading}
              onCancel={handleCancel}
              width={950}
              centered
              >
              <RecipientList
                RecipientList={props.NewsLetterDTO?.recipients}
                handleAddToEmailList = {handleAddToEmailList}
                handleDeleteEmail={handleDeleteEmail}
                ></RecipientList>
            </Modal>

            
            <Modal
              title="Schedule for Automatic Task"
              open={showScheduler}
             
              footer={[]}
              width={700}
              centered
              >
                <ScheduleForm 
                  onSubmitHandle={handleScheduleSubmit}
                  ScheduleDTO={props?.ScheduleDTO}></ScheduleForm>   
              </Modal>

              
        </Space>


        
        
        {AttachOverlay?
          /**
           * File Upload Picker
           */
          <PickerOverlay 
              apikey={API_KEY}                
              onUploadDone={(res:any) => FileUploadDone(res)}  
          ></PickerOverlay>
        :null}
       
        <FloatButton.Group shape="circle" style={{ right: 40 }}>
            <FloatButton
              onClick={SendNewsLetterNowHandler}
              tooltip="Send the Newsletter NOW!"
              icon={<SendOutlined />}
              type='primary'
            />
           
            <FloatButton
              onClick={showEmailListHandler}
              tooltip="Show and Update recipient list"
            />
            <FloatButton
              onClick={handleShowScheduler}
              tooltip="Schedule Newsletter Task"
              icon= {<ClockCircleOutlined />}
            />
            <FloatButton
              onClick={saveHandler}
              icon={<CheckCircleOutlined />}    
              type='primary'
              tooltip="Save Changes"            
            />
            
            <FloatButton.BackTop visibilityHeight={0} 
                onClick={cancelHandler}
                icon={<CloseCircleOutlined/>}
                type='primary'            
                tooltip="Back to Newsletter List"
                />
        </FloatButton.Group>


       


      </div>
      
   )

   


}