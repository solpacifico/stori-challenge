import React, { useRef, useState } from 'react';
import { RecipientListProps } from '../models/RecipientListProps';

import { Button, Col, Input, InputRef, Popconfirm, Row, Space, Table, TableColumnType, TableColumnsType,  } from 'antd';
import Column from 'antd/es/table/Column';
import TextArea from 'antd/es/input/TextArea';
import { FilterDropdownProps } from 'antd/es/table/interface';
import { Recipient } from '../types/Recipient';
import {SearchOutlined, FileAddOutlined} from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import "./RecipientList.css"
import "../helpers/TextHelper"
import { BuildEmailList } from '../helpers/TextHelper';


export function RecipientList (props:RecipientListProps){

    type DataIndex = keyof Recipient;

    const [EmailListText, setEmailListText] = useState("");

    const handleDeleteEmail = (id: number): void =>{
        props.handleDeleteEmail && props.handleDeleteEmail(id);
    }

    const handleAddToEmailList = ()=>{
        const emailListObject = BuildEmailList(EmailListText);
        
        const RecipientList:Recipient[]=[];
        emailListObject.map((x:{ email:string , isValid:boolean }) => {
            if(x.isValid){
                let rec:Recipient ={ id:0, name:"", email:x.email}
                RecipientList.push(rec);
            }
        })
        props.handleAddToEmailList && props.handleAddToEmailList(RecipientList);
    }

    const EmailTable: React.FC = () => {
        const [searchText, setSearchText] = useState('');
        const [searchedColumn, setSearchedColumn] = useState('');
        const searchInput = useRef<InputRef>(null);
      
        const handleSearch = (
          selectedKeys: string[],
          confirm: FilterDropdownProps['confirm'],
          dataIndex: DataIndex,
        ) => {
          confirm();
          setSearchText(selectedKeys[0]);
          setSearchedColumn(dataIndex);
        };
      
        const handleReset = (clearFilters: () => void) => {
          clearFilters();
          setSearchText('');
        };


      
        const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<Recipient> => ({
          filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
              <Input
                ref={searchInput}
                placeholder={`Search ${dataIndex}`}
                value={selectedKeys[0]}
                onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                style={{ marginBottom: 8, display: 'block' }}
              />
              <Space>
                <Button
                  type="primary"
                  onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                  icon={<SearchOutlined />}
                  size="small"
                  style={{ width: 90 }}
                >
                  Search
                </Button>
                <Button
                  onClick={() => clearFilters && handleReset(clearFilters)}
                  size="small"
                  style={{ width: 90 }}
                >
                  Reset
                </Button>
                <Button
                  type="link"
                  size="small"
                  onClick={() => {
                    confirm({ closeDropdown: false });
                    setSearchText((selectedKeys as string[])[0]);
                    setSearchedColumn(dataIndex);
                  }}
                >
                  Filter
                </Button>
                <Button
                  type="link"
                  size="small"
                  onClick={() => {
                    close();
                  }}
                >
                  close
                </Button>
              </Space>
            </div>
          ),
          filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
          ),
          onFilter: (value, record) =>
            record[dataIndex]
              .toString()
              .toLowerCase()
              .includes((value as string).toLowerCase()),
          onFilterDropdownOpenChange: (visible) => {
            if (visible) {
              setTimeout(() => searchInput.current?.select(), 100);
            }
          },
          render: (text) =>
            searchedColumn === dataIndex ? (
              <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text ? text.toString() : ''}
              />
            ) : (
              text
            ),
        });
      
        const columns: TableColumnsType<Recipient> = [
         
          {
            title: 'Email Address',
            dataIndex: 'email',
            key: 'email',
            ...getColumnSearchProps('email'),
            sorter: (a, b) => a.email.length - b.email.length,
            sortDirections: ['descend', 'ascend'],
          },
          {
            title: 'Action',
            key: 'operation',
            fixed: 'right',
            width: 100,
            render: (_: any, record: {id:number}) => (
                <Space size="middle">
                  { props.RecipientList && props.RecipientList.length >= 1 ? (
                    <Space size="middle">
                        
                        <Popconfirm title="Sure to delete?" onConfirm={() => handleDeleteEmail(record.id)}>
                            <a>Delete</a>
                        </Popconfirm>

                    </Space>
                        ) : null}
                </Space>
                ),
          },
        ];
      
        return <Table columns={columns} dataSource={props.RecipientList} />;
    }
    
    return(
        

        <>
            <Row gutter={50}>
                <Col span={2}></Col>
                <Col>Recipient List:</Col>
            </Row>
            <Row><div></div></Row>
            <Row>
                <Col span={4}></Col>
                <Col span={9}>
                    <TextArea 
                        rows={20} 
                        placeholder="maxLength is 20" 
                        
                        value={EmailListText} 
                        onChange={(e) => setEmailListText(e.target.value)}/>
                </Col>
                <Col span={3} >
                    <div className='center-content'>
                        <Button 
                            onClick={handleAddToEmailList}
                            type="primary" 
                            shape="round" 
                            icon={<FileAddOutlined />} 
                            size="large" />
                    </div>
                </Col>
                <Col span={8}>
                    <EmailTable></EmailTable>
                </Col>
            </Row>
        
            
            
        
        </>
    )

    


}


