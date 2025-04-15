import React, {useState} from 'react';
import Container from "../../../components/Container.jsx";
import {Button, Input, Pagination, Popconfirm, Row, Select, Space, Table} from "antd";
import {get} from "lodash";
import {useTranslation} from "react-i18next";
import usePaginateQuery from "../../../hooks/api/usePaginateQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import dayjs from "dayjs";
import useGetAllQuery from "../../../hooks/api/useGetAllQuery.js";
import useDeleteQuery from "../../../hooks/api/useDeleteQuery.js";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";

const VisitsContainer = () => {
    const {t} = useTranslation();
    const [page, setPage] = useState(0);
    const [searchKey,setSearchKey] = useState(null);
    const [userId, setUserId] = useState(null);

    const {data,isLoading} = usePaginateQuery({
        key: KEYS.visit_list,
        url: URLS.visit_list,
        params: {
            params: {
                size: 10,
                search: searchKey,
                userId
            }
        },
        page
    });

    const {data:users,isLoading:isLoadingUsers} = useGetAllQuery({
        key: KEYS.users_list,
        url: URLS.users_list,
        params: {
            params: {
                size: 1000,
            }
        }
    })

    const { mutate } = useDeleteQuery({
        listKeyId: KEYS.visit_list
    });
    const useDelete = (id) => {
        mutate({url: `${URLS.visit_delete}/${id}`})
    }

    const columns = [
        {
            title: t("ID"),
            dataIndex: "id",
            key: "id",
        },
        {
            title: t("FIO"),
            dataIndex: "fio",
            key: "fio"
        },
        {
            title: t("Phone"),
            dataIndex: "phone",
            key: "phone"
        },
        {
            title: t("Place of work"),
            dataIndex: "placeOfWork",
            key: "placeOfWork"
        },
        {
            title: t("Specialization"),
            dataIndex: "specialization",
            key: "specialization"
        },
        {
            title: t("Med institution"),
            dataIndex: "medInstitutionName",
            key: "medInstitutionName"
        },
        {
            title: t("Visited by"),
            dataIndex: "visitedBy",
            key: "visitedBy"
        },
        {
            title: t("Position"),
            dataIndex: "position",
            key: "position"
        },
        {
            title: t("Created at"),
            dataIndex: "createdAt",
            key: "createdAt",
            render: (props) => dayjs(props).format("YYYY-MM-DD HH:mm:ss"),
        },
        {
            title: t("Delete"),
            fixed: 'right',
            key: 'action',
            render: (props, data) => (
                <Popconfirm
                    title={t("Delete")}
                    description={t("Are you sure to delete?")}
                    onConfirm={() => useDelete(get(data,'id'))}
                    okText={t("Yes")}
                    cancelText={t("No")}
                >
                    <Button danger icon={<DeleteOutlined />}/>
                </Popconfirm>
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

                    <Select
                        allowClear
                        loading={isLoadingUsers}
                        options={get(users,'data.content',[])?.map(user => ({
                            label: `${get(user,'firstName')} ${get(user,'lastName')}`,
                            value: get(user,'id'),
                        }))}
                        style={{width: 300}}
                        placeholder={t("User")}
                        onClear={() => setUserId(null)}
                        onSelect={(value) => setUserId(value)}
                        showSearch
                    />
                </Space>

                <Table
                    columns={columns}
                    dataSource={get(data,'data.content',[])}
                    bordered
                    size={"middle"}
                    pagination={false}
                    loading={isLoading}
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

export default VisitsContainer;
