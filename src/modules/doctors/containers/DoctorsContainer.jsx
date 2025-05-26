import React, {useState} from 'react';
import Container from "../../../components/Container.jsx";
import {Button, DatePicker, Input, message, Modal, Pagination, Popconfirm, Row, Space, Table, Typography} from "antd";
import {get} from "lodash";
import {useTranslation} from "react-i18next";
import usePaginateQuery from "../../../hooks/api/usePaginateQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import dayjs from "dayjs";
import {DeleteOutlined, EditOutlined, FileExcelOutlined} from "@ant-design/icons";
import useDeleteQuery from "../../../hooks/api/useDeleteQuery.js";
import EditDoctor from "../components/EditDoctor.jsx";
import {request} from "../../../services/api/index.js";

const DoctorsContainer = () => {
    const {t} = useTranslation();
    const [page, setPage] = useState(0);
    const [params, setParams] = useState({});
    const [selected, setSelected] = useState(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const {data,isLoading} = usePaginateQuery({
        key: KEYS.doctors_list,
        url: URLS.doctors_list,
        params: {
            params: {
                size: 10,
                ...params,
                from: get(params,'from') ? get(params,'from')?.toISOString() : null,
                to: get(params,'to') ? get(params,'to')?.toISOString() : null
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

    const onChange = (name,value) => {
        setParams(prevState => ({...prevState, [name]: value}))
    }

    const getExcel = async () => {
        try {
            const response = await request.get("/api/admin/doctors/export",{responseType: "blob"});
            const blob = new Blob([get(response,'data')]);
            saveAs(blob, `Doctors ${dayjs().format("YYYY-MM-DD")}.xlsx`)
        }catch (error) {
            message.error(t("Fayl shakllantirishda xatolik"))
        }finally {
            setIsDownloading(false);
        }
    }

    const columns = [
        {
            title: (
                <Space direction="vertical">
                    {t("FIO")}
                    <Input
                        placeholder={t("FIO")}
                        allowClear
                        value={get(params,'fio','')}
                        onChange={(e) => {
                            const value = get(e,'target.value');
                            onChange('fio', value)
                        }}
                    />
                </Space>
            ),
            dataIndex: "fio",
            key: "fio"
        },
        {
            title: (
                <Space direction="vertical">
                    {t("Phone")}
                    <Input
                        placeholder={t("Phone")}
                        allowClear
                        value={get(params,'phone','')}
                        onChange={(e) => {
                            const value = get(e,'target.value');
                            onChange('phone', value)
                        }}
                    />
                </Space>
            ),
            dataIndex: "phone",
            key: "phone"
        },
        {
            title: t("Second place"),
            dataIndex: "secondPlaceOfWork",
            key: "secondPlaceOfWork"
        },
        {
            title: (
                <Space direction="vertical">
                    {t("Specialization")}
                    <Input
                        allowClear
                        placeholder={t("Specialization")}
                        value={get(params,'specialization','')}
                        onChange={(e) => {
                            const value = get(e,'target.value');
                            onChange('specialization', value)
                        }}
                    />
                </Space>
            ),
            dataIndex: "specialization",
            key: "specialization"
        },
        {
            title: (
                <Space direction="vertical">
                    {t("Med institution")}
                    <Input
                        allowClear
                        placeholder={t("Med institution")}
                        value={get(params,'medInstitutionName','')}
                        onChange={(e) => {
                            const value = get(e,'target.value');
                            onChange('medInstitutionName', value)
                        }}
                    />
                </Space>
            ),
            dataIndex: "medInstitution",
            key: "medInstitution"
        },
        {
            title: t("Position"),
            dataIndex: "position",
            key: "position"
        },
        {
            title: (
                <Space direction="vertical">
                    {t("Created by")}
                    <Input
                        allowClear
                        placeholder={t("Created by")}
                        value={get(params,'createdBy','')}
                        onChange={(e) => {
                            const value = get(e,'target.value');
                            onChange('createdBy', value)
                        }}
                    />
                </Space>
            ),
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
                <Row justify={'space-between'}>
                    <Space>
                        <DatePicker
                            allowClear
                            placeholder={t("Dan")}
                            format="YYYY-MM-DD"
                            value={get(params, 'from') ? dayjs(get(params, 'from')) : null}
                            onChange={(date) => onChange('from', date)}
                        />
                        <DatePicker
                            allowClear
                            placeholder={t("Gacha")}
                            format="YYYY-MM-DD"
                            value={get(params, 'to') ? dayjs(get(params, 'to')) : null}
                            onChange={(date) => onChange('to', date)}
                        />
                    </Space>
                    <Button icon={<FileExcelOutlined/>} type="primary" onClick={() => {
                        setIsDownloading(true);
                        getExcel()
                    }} loading={isDownloading} >
                        {t("Excelни олиш")}
                    </Button>
                </Row>

                <Table
                    columns={columns}
                    dataSource={get(data,'data.content',[])}
                    bordered
                    size={"middle"}
                    pagination={false}
                    loading={isLoading}
                    scroll={{ x: 'max-content' }}
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
