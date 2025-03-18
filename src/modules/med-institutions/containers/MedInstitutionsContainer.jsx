import React, {useState} from 'react';
import Container from "../../../components/Container.jsx";
import {Button, Image, Input, Pagination, Popconfirm, Row, Space, Table} from "antd";
import {get} from "lodash";
import {useTranslation} from "react-i18next";
import usePaginateQuery from "../../../hooks/api/usePaginateQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import usePatchQuery from "../../../hooks/api/usePatchQuery.js";
import {CheckOutlined, CloseOutlined, EyeOutlined} from "@ant-design/icons";
import dayjs from "dayjs";

const MedInstitutionsContainer = () => {
    const {t} = useTranslation();
    const [page, setPage] = useState(0);
    const [searchKey,setSearchKey] = useState();

    const {data,isLoading} = usePaginateQuery({
        key: KEYS.med_institutions_list,
        url: URLS.med_institutions_list,
        params: {
            params: {
                size: 10,
                search: searchKey
            }
        },
        page
    });

    const {mutate:accept} = usePatchQuery({
        listKeyId: KEYS.med_institutions_list,
    })

    const useAccept = (id,isAccept) => {
        accept({url: `${URLS.med_institutions_edit}/${id}?accept=${isAccept}`})
    }

    const columns = [
        {
            title: t("ID"),
            dataIndex: "id",
            key: "id",
        },
        {
            title: t("Name"),
            dataIndex: "name",
            key: "name"
        },
        {
            title: t("Status"),
            dataIndex: "status",
            key: "status"
        },
        {
            title: t("District name"),
            dataIndex: "districtName",
            key: "districtName"
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

export default MedInstitutionsContainer;
