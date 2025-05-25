import React, {useState} from 'react';
import Container from "../../../components/Container.jsx";
import {Button, DatePicker, Input, message, Pagination, Popconfirm, Row, Space, Table, Typography} from "antd";
import {get} from "lodash";
import {useTranslation} from "react-i18next";
import usePaginateQuery from "../../../hooks/api/usePaginateQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import dayjs from "dayjs";
import useDeleteQuery from "../../../hooks/api/useDeleteQuery.js";
import {DeleteOutlined, FileExcelOutlined} from "@ant-design/icons";
import {request} from "../../../services/api/index.js";
import {saveAs} from "file-saver";

const VisitsContainer = () => {
    const {t} = useTranslation();
    const [page, setPage] = useState(0);
    const [params, setParams] = useState({});
    const [isDownloading, setIsDownloading] = useState(false);

    const {data,isLoading} = usePaginateQuery({
        key: KEYS.visit_list,
        url: URLS.visit_list,
        params: {
            params: {
                size: 10,
                ...params,
            }
        },
        page
    });

    const { mutate } = useDeleteQuery({
        listKeyId: KEYS.visit_list
    });
    const useDelete = (id) => {
        mutate({url: `${URLS.visit_delete}/${id}`})
    }

    const onChange = (name,value) => {
        setParams(prevState => ({...prevState, [name]: value}))
    }

    const getExcel = async () => {
        try {
            const response = await request.get("/api/admin/visits/export",{responseType: "blob"});
            const blob = new Blob([get(response,'data')]);
            saveAs(blob, `Visits ${dayjs().format("YYYY-MM-DD")}.xlsx`)
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
                        allowClear
                        placeholder={t("FIO")}
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
                        allowClear
                        placeholder={t("Phone")}
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
            dataIndex: "medInstitutionName",
            key: "medInstitutionName"
        },
        {
            title: (
                <Space direction="vertical">
                    {t("Visited by")}
                    <Input
                        allowClear
                        placeholder={t("Visited by")}
                        value={get(params,'visitedBy','')}
                        onChange={(e) => {
                            const value = get(e,'target.value');
                            onChange('visitedBy', value)
                        }}
                    />
                </Space>
            ),
            dataIndex: "visitedBy",
            key: "visitedBy"
        },
        {
            title: (
                <Space direction="vertical">
                    {t("Created at")}
                    <DatePicker
                        allowClear
                        showTime
                        format="YYYY-MM-DDTHH:mm:ss"
                        value={get(params, 'from') ? dayjs(get(params, 'from')) : null}
                        onChange={(date, dateString) => {
                            onChange('from', dateString);
                        }}
                    />
                </Space>
            ),
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
                <Row justify={'end'}>
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

export default VisitsContainer;
