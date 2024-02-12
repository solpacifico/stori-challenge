// ScheduleForm.tsx

import React from 'react';
import { Form, Input, Button, DatePicker, Switch, InputNumber, TimePicker, Select } from 'antd';
import { ScheduleFormProps } from '../models/ScheduleFormProps';
import { Schedule } from '../types/Sechedule';
import dayjs from 'dayjs';



const { Option } = Select;

export function ScheduleForm (props:ScheduleFormProps) {
  
  const onFinish = (values: Schedule) => {
    console.log(values);
    const scheduleDTOx:Schedule = {
      scheduleId: props.ScheduleDTO?.scheduleId?props.ScheduleDTO.scheduleId:0,
      newsLetterId: props.ScheduleDTO?.newsLetterId?props.ScheduleDTO.newsLetterId:0,
      active: values.active?values.active:props.ScheduleDTO?.active??false,
      sendTime: values.sendTime?values.sendTime:props.ScheduleDTO?.sendTime??new Date(),
      sendWeekDay: values.sendWeekDay?values.sendWeekDay:props.ScheduleDTO?.sendWeekDay??0,
      sendMonthDay: values.sendMonthDay?values.sendMonthDay:props.ScheduleDTO?.sendMonthDay??0,
      sendDate: values.sendDate?values.sendDate:props.ScheduleDTO?.sendDate??new Date(),
      repeat: values.repeat?values.repeat:props.ScheduleDTO?.repeat??false
    }

    props.onSubmitHandle && props.onSubmitHandle(scheduleDTOx);
  };


  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  return (
    <Form  onFinish={onFinish} 
      {...layout}  style={{ maxWidth: 600 }}>
      
      <Form.Item label="Schedule ID" name="scheduleId">
        <Input type="number" defaultValue={props?.ScheduleDTO?.scheduleId}/>
      </Form.Item>
      <Form.Item label="Newsletter ID" name="newsLetterId" hidden={true}>
        <Input type="number" defaultValue={props?.ScheduleDTO?.newsLetterId} />
      </Form.Item>
      <Form.Item label="Active" name="active" valuePropName="checked">
        <Switch defaultValue={false} />
      </Form.Item>
      <Form.Item label="Send Time" name="sendTime">
      <TimePicker defaultValue={dayjs(props?.ScheduleDTO?.sendTime)}/>
      </Form.Item>
      {/* <Form.Item label="Send Weekday" name="sendWeekDay">
        <Input type="number" />
      </Form.Item> */}
      <Form.Item
        name="sendWeekDay"
        label="Send Weekday"
        hasFeedback       
        >
          <Select placeholder="Please a Week Day" defaultValue={props?.ScheduleDTO?.sendWeekDay}>
            <Option value="1">Mon</Option>
            <Option value="2" >Tue</Option>
            <Option value="3">Wed</Option>
            <Option value="4">Thu</Option>
            <Option value="5">Fri</Option>
            <Option value="6">Sat</Option>
            <Option value="7">Sun</Option>
          </Select>
    </Form.Item>
      <Form.Item label="Send Month Day" name="sendMonthDay">
        <InputNumber min={1} max={31} />
      </Form.Item>
      <Form.Item label="Send Date" name="sendDate">
        <DatePicker format="YYYY-MM-DD" />
      </Form.Item>
      <Form.Item label="Repeat" name="repeat" valuePropName="checked">
        <Switch />
      </Form.Item>
      <Form.Item style={{textAlign:'end'}}>
        <Button type="primary" htmlType="submit">
          Save Schedule
        </Button>
      </Form.Item>
    </Form>
  );
};


