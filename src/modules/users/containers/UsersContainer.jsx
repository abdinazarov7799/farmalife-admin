import React, {useState} from 'react';
import Container from "../../../components/Container.jsx";
import {Button, Input, Modal, Pagination, Row, Space, Switch, Table} from "antd";
import {get} from "lodash";
import {useTranslation} from "react-i18next";
import usePaginateQuery from "../../../hooks/api/usePaginateQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import {EditOutlined, PlusOutlined} from "@ant-design/icons";
import usePutQuery from "../../../hooks/api/usePutQuery.js";
import CreateEditUser from "../components/CreateEditUser.jsx";

const UsersContainer = () => {
    const {t} = useTranslation();
    const [page, setPage] = useState(0);
    const [searchKey,setSearchKey] = useState();
    const [isCreateModalOpenCreate, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [itemData, setItemData] = useState(null);

    const {data,isLoading} = usePaginateQuery({
        key: KEYS.users_list,
        url: URLS.users_list,
        params: {
            params: {
                size: 10,
                search: searchKey
            }
        },
        page
    });

    const {mutate:block} = usePutQuery({listKeyId: KEYS.users_list})

    const columns = [
        {
            title: t("ID"),
            dataIndex: "id",
            key: "id",
        },
        {
            title: t("First name"),
            dataIndex: "firstName",
            key: "firstName"
        },
        {
            title: t("Last name"),
            dataIndex: "lastName",
            key: "lastName"
        },
        {
            title: t("Phone number"),
            dataIndex: "phoneNumber",
            key: "phoneNumber",
        },
        {
            title: t("Blocked"),
            dataIndex: "blocked",
            key: "registered",
            render: (props,data) => {
                return (
                    <Switch disabled value={get(data,'blocked')}/>
                )
            }
        },
        {
            title: t("Edit"),
            width: 80,
            fixed: 'right',
            key: 'action',
            render: (props, data, index) => (
                <Button key={index} icon={<EditOutlined />} onClick={() => {
                    setIsEditModalOpen(true)
                    setItemData(data)
                }} />
            )
        }
    ]
    return (
        <Container>
            <Space direction={"vertical"} style={{width: "100%"}} size={"middle"}>
                <Space size={"middle"}>
                    <Input.Search
                        placeholder={t("Search")}
                        onChange={(e) => setSearchKey(e.target.value)}
                        allowClear
                    />
                    <Button
                        icon={<PlusOutlined />}
                        type={"primary"}
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        {t("New")}
                    </Button>
                    <Modal
                        title={t('Create')}
                        open={isCreateModalOpenCreate}
                        onCancel={() => setIsCreateModalOpen(false)}
                        footer={null}
                    >
                        <CreateEditUser setIsModalOpen={setIsCreateModalOpen}/>
                    </Modal>
                    <Modal
                        title={t("Edit")}
                        open={isEditModalOpen}
                        onCancel={() => setIsEditModalOpen(false)}
                        footer={null}
                    >
                        <CreateEditUser
                            itemData={itemData}
                            setIsModalOpen={setIsEditModalOpen}
                        />
                    </Modal>
                </Space>

                <Table
                    columns={columns}
                    dataSource={get(data,'data.content',[])}
                    bordered
                    size={"middle"}
                    pagination={false}
                    loading={isLoading}
                    onRow={(props) => {
                        if (!get(props,'hasActivityToday')){
                            return {
                                style: {
                                    backgroundColor: "rgba(255,99,99,0.29)"}
                            }
                        }
                    }}
                />

                <Row justify={"end"} style={{marginTop: 10}}>
                    <Pagination
                        current={page+1}
                        onChange={(page) => setPage(page - 1)}
                        total={get(data,'data.totalPages') * 10 }
                        showSizeChanger={false}
                    />
                </Row>
            </Space>
        </Container>
    );
};

export default UsersContainer;
