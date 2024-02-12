import React from 'react';
import { NewsLetterListProps } from '../models/NewsLetterListProps';
import { NewsLetter } from '../types/NewsLetter';

import { Popconfirm, Space, Table, Tag } from 'antd';

const { Column, ColumnGroup } = Table;


export function  NewsLetterList( props:NewsLetterListProps)  {

    const handleDelete = (key: number) => {
       props.handleDelete && props.handleDelete(key);
    };

    const handleEdit = (key: number) => {
        props.handleEdit && props.handleEdit(key);
    };

   
    const NewsLetterTable  = (data:NewsLetter[]) => {
        
        return(
        
            <Table dataSource={data} rowKey="id">
           
            <Column title="Name" dataIndex="name" key="name" />            
            <Column title="Description" dataIndex="description" key="description" />
            <Column title="Customer" dataIndex="customer" key="customer" />
            
            <Column
                title="Action"
                key="id"
                render={(_: any, record: {id:number}) => (
                <Space size="middle">
                  { data.length >= 1 ? (
                    <Space size="middle">
                        <a onClick={()=> handleEdit(record.id)}> Edit</a>
                        <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.id)}>
                            <a>Delete</a>
                        </Popconfirm>

                    </Space>
                        ) : null}
                </Space>
                )}
            />
            </Table>
        );
    }
    
    
    return(
        <div>
            {NewsLetterTable(props.NewsLetterListDTO)}
        </div>
    );


} 