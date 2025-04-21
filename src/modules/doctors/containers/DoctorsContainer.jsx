import React, {useState} from 'react';
import Container from "../../../components/Container.jsx";
import {Button, Input, Modal, Pagination, Popconfirm, Row, Space, Table, Typography} from "antd";
import {get} from "lodash";
import {useTranslation} from "react-i18next";
import usePaginateQuery from "../../../hooks/api/usePaginateQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import dayjs from "dayjs";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import useDeleteQuery from "../../../hooks/api/useDeleteQuery.js";
import EditDoctor from "../components/EditDoctor.jsx";

const DoctorsContainer = () => {
    const {t} = useTranslation();
    const [page, setPage] = useState(0);
    const [searchKey,setSearchKey] = useState();
    const [selected, setSelected] = useState(null);

    const {data,isLoading} = usePaginateQuery({
        key: KEYS.doctors_list,
        url: URLS.doctors_list,
        params: {
            params: {
                size: 10,
                search: searchKey
            }
        },
        page
    });

    const { mutate } = useDeleteQuery({
        listKeyId: KEYS.doctors_list
    });
    const useDelete = (id) => {
        mutate({url: `${URLS.doctor_delete}/${id}`})
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
            title: t("Second place"),
            dataIndex: "secondPlaceOfWork",
            key: "secondPlaceOfWork"
        },
        {
            title: t("Specialization"),
            dataIndex: "specialization",
            key: "specialization"
        },
        {
            title: t("Med institution"),
            dataIndex: "medInstitution",
            key: "medInstitution"
        },
        {
            title: t("Position"),
            dataIndex: "position",
            key: "position"
        },
        {
            title: t("Created by"),
            dataIndex: "createdBy",
            key: "createdBy"
        },
        {
            title: t("Created at"),
            dataIndex: "createdAt",
            key: "createdAt",
            render: (props) => dayjs(props).format("YYYY-MM-DD HH:mm:ss"),
        },
        {
            title: t("Edit / Delete"),
            width: 120,
            fixed: 'right',
            key: 'action',
            render: (props, data, index) => (
                <Space key={index}>
                    <Button icon={<EditOutlined />} onClick={() => {
                        setSelected(data)
                    }} />
                    <Popconfirm
                        title={t("Delete")}
                        description={t("Are you sure to delete?")}
                        onConfirm={() => useDelete(get(data,'id'))}
                        okText={t("Yes")}
                        cancelText={t("No")}
                    >
                        <Button danger icon={<DeleteOutlined />}/>
                    </Popconfirm>
                </Space>
            )
        }
    ]
    return (
        <Container>
            <Modal
                title={t('Edit')}
                open={!!selected}
                onCancel={() => setSelected(null)}
                footer={null}
            >
                <EditDoctor setSelected={setSelected} selected={selected} />
            </Modal>
            <Space direction={"vertical"} style={{width: "100%"}} size={"middle"}>
                <Space size={"middle"}>
                    <Input.Search
                        placeholder={t("Search")}
                        onChange={(e) => setSearchKey(e.target.value)}
                        allowClear
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

                <Row justify={"space-between"} style={{marginTop: 10}}>
                    <Typography.Title level={4}>
                        {t("Miqdori")}: {get(data,'data.totalElements')} {t("ta")}
                    </Typography.Title>
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

export default DoctorsContainer;
