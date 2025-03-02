import React, {useState} from 'react';
import Container from "../../../components/Container.jsx";
import {Button, Image, Input, Modal, Pagination, Row, Space, Table} from "antd";
import {get} from "lodash";
import {useTranslation} from "react-i18next";
import usePaginateQuery from "../../../hooks/api/usePaginateQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import {EyeOutlined} from "@ant-design/icons";

const StocksContainer = () => {
    const {t} = useTranslation();
    const [page, setPage] = useState(0);
    const [detailsPage, setDetailsPage] = useState(0);
    const [searchKey,setSearchKey] = useState();
    const [selected, setSelected] = useState(null);

    const {data,isLoading} = usePaginateQuery({
        key: KEYS.stocks_list,
        url: URLS.stocks_list,
        params: {
            params: {
                size: 10,
                search: searchKey
            }
        },
        page
    });

    const {data:details,isLoading:isLoadingDetails} = usePaginateQuery({
        key: `${KEYS.stock_details}/${get(selected,'id')}`,
        url: `${URLS.stock_details}/${get(selected,'id')}`,
        enabled: !!get(selected,'id'),
        page: detailsPage
    })

    const columns = [
        {
            title: t("ID"),
            dataIndex: "id",
            key: "id",
        },
        {
            title: t("Status"),
            dataIndex: "status",
            key: "status",
        },
        {
            title: t("User"),
            dataIndex: "userData",
            key: "userData"
        },
        {
            title: t("Pharmacy"),
            dataIndex: "pharmacy",
            key: "pharmacy"
        },
        {
            title: t("Image"),
            key: "photoUrl",
            dataIndex: "photoUrl",
            align: "center",
            render: (props) => <Image src={props} width={80} height={50} />
        },
        {
            title: t("Offline created at"),
            dataIndex: "offlineCreatedAt",
            key: "offlineCreatedAt",
        },
        {
            title: t("Created at"),
            dataIndex: "createdAt",
            key: "createdAt",
        },
        {
            title: t("Details"),
            key: "details",
            render: (props) => (<Button icon={<EyeOutlined />} type={"primary"} onClick={() => setSelected(props)}/>)
        },
    ]

    const detailColumns = [
        {
            title: t("Drug name"),
            dataIndex: "drugName",
            key: "drugName",
        },
        {
            title: t("Quantity"),
            dataIndex: "quantity",
            key: "quantity"
        },
        {
            title: t("Image"),
            key: "photoUrl",
            dataIndex: "photoUrl",
            align: "center",
            render: (props) => <Image src={props} width={80} height={50} />
        },
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
            <Modal footer={null} title={get(selected,'id')} open={!!selected} onCancel={() => setSelected(null)} width={1000}>
                <Space direction={"vertical"} style={{width: "100%"}} size={"middle"}>
                    <Table
                        columns={detailColumns}
                        dataSource={get(details,'data.content',[])}
                        bordered
                        size={"middle"}
                        pagination={false}
                        loading={isLoadingDetails}
                    />

                    <Row justify={"end"} style={{marginTop: 10}}>
                        <Pagination
                            current={page+1}
                            onChange={(page) => setPage(page - 1)}
                            total={get(details,'data.totalPages') * 10 }
                            showSizeChanger={false}
                        />
                    </Row>
                </Space>
            </Modal>
        </Container>
    );
};

export default StocksContainer;
