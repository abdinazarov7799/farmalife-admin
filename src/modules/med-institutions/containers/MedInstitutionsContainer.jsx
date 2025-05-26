import React, {useState} from 'react';
import Container from "../../../components/Container.jsx";
import {
    Button,
    DatePicker,
    Image,
    Input,
    message,
    Modal,
    Pagination,
    Popconfirm,
    Row,
    Space,
    Table,
    Typography
} from "antd";
import {get} from "lodash";
import {useTranslation} from "react-i18next";
import usePaginateQuery from "../../../hooks/api/usePaginateQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import usePatchQuery from "../../../hooks/api/usePatchQuery.js";
import {
    CheckOutlined,
    CloseOutlined,
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    FileExcelOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import EditMed from "../components/EditMed.jsx";
import useDeleteQuery from "../../../hooks/api/useDeleteQuery.js";
import {request} from "../../../services/api/index.js";

const MedInstitutionsContainer = () => {
    const {t} = useTranslation();
    const [page, setPage] = useState(0);
    const [searchKey,setSearchKey] = useState();
    const [selected, setSelected] = useState(null);
    const [params, setParams] = useState({});
    const [isDownloading, setIsDownloading] = useState(false);

    const {data,isLoading} = usePaginateQuery({
        key: KEYS.med_institutions_list,
        url: URLS.med_institutions_list,
        params: {
            params: {
                size: 10,
                search: searchKey,
                ...params,
                from: get(params,'from') ? get(params,'from')?.toISOString() : null,
                to: get(params,'to') ? get(params,'to')?.toISOString() : null
            }
        },
        page
    });

    const {mutate:accept} = usePatchQuery({
        listKeyId: KEYS.med_institutions_list,
    })

    const useAccept = (id,isAccept) => {
        accept({url: `${URLS.med_institutions_edit_status}/${id}?accept=${isAccept}`})
    }

    const { mutate } = useDeleteQuery({
        listKeyId: KEYS.med_institutions_list
    });
    const useDelete = (id) => {
        mutate({url: `${URLS.med_institutions_delete}/${id}`})
    }

    const onChange = (name,value) => {
        setParams(prevState => ({...prevState, [name]: value}))
    }

    const getExcel = async () => {
        try {
            const response = await request.get("/api/admin/med-institutions/export",{responseType: "blob"});
            const blob = new Blob([get(response,'data')]);
            saveAs(blob, `Med institutions ${dayjs().format("YYYY-MM-DD")}.xlsx`)
        }catch (error) {
            message.error(t("Fayl shakllantirishda xatolik"))
        }finally {
            setIsDownloading(false);
        }
    }

    const columns = [
        {
            title: t("ID"),
            dataIndex: "id",
            key: "id",
        },
        {
            title: (
                <Space direction="vertical">
                    {t("Name")}
                    <Input
                        allowClear
                        placeholder={t("Name")}
                        value={get(params,'name','')}
                        onChange={(e) => {
                            const value = get(e,'target.value');
                            onChange('name', value)
                        }}
                    />
                </Space>
            ),
            dataIndex: "name",
            key: "name"
        },
        {
            title: t("Status"),
            dataIndex: "status",
            key: "status"
        },
        {
            title: (
                <Space direction="vertical">
                    {t("District name")}
                    <Input
                        allowClear
                        placeholder={t("District name")}
                        value={get(params,'districtName','')}
                        onChange={(e) => {
                            const value = get(e,'target.value');
                            onChange('districtName', value)
                        }}
                    />
                </Space>
            ),
            dataIndex: "districtName",
            key: "districtName"
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
            title: t("Image"),
            key: "photoUrl",
            dataIndex: "photoUrl",
            align: "center",
            render: (props) => <Image src={props} width={80} height={50} />
        },
        {
            title: t("Location"),
            key: "location",
            align: "center",
            render: (props) => {
                const openMap = () => {
                    if (props?.lat && props?.lng) {
                        const url = `https://www.google.com/maps?q=${props.lat},${props.lng}`;
                        window.open(url, "_blank");
                    } else {
                        console.warn("Location data is missing");
                    }
                };
                return <Button onClick={openMap} icon={<EyeOutlined/>} />
            }
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
        },
        {
            title: t("Reject / Accept"),
            width: 90,
            fixed: 'right',
            key: 'action',
            render: (props, data) => (
                <Space>
                    <Popconfirm
                        title={t("Reject")}
                        description={t("Are you sure to reject?")}
                        onConfirm={() => useAccept(get(data,'id'),false)}
                        okText={t("Yes")}
                        cancelText={t("No")}
                    >
                        <Button danger icon={<CloseOutlined />}/>
                    </Popconfirm>
                    <Popconfirm
                        title={t("Accept")}
                        description={t("Are you sure to accept?")}
                        onConfirm={() => useAccept(get(data,'id'),true)}
                        okText={t("Yes")}
                        cancelText={t("No")}
                    >
                        <Button type={"primary"} icon={<CheckOutlined />}/>
                    </Popconfirm>
                </Space>
            )
        }
    ]
    return (
        <Container>
            <Space direction={"vertical"} style={{width: "100%"}} size={"middle"}>
                <Row justify={'space-between'}>
                    <Space>
                        <Input.Search
                            placeholder={t("Search")}
                            onChange={(e) => setSearchKey(e.target.value)}
                            allowClear
                        />
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
            <Modal
                title={t('Edit')}
                open={!!selected}
                onCancel={() => setSelected(null)}
                footer={null}
            >
                <EditMed setSelected={setSelected} selected={selected} />
            </Modal>
        </Container>
    );
};

export default MedInstitutionsContainer;
