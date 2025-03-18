import React, {useState} from 'react';
import Container from "../../../components/Container.jsx";
import {Input, Pagination, Row, Space, Table} from "antd";
import {get} from "lodash";
import {useTranslation} from "react-i18next";
import usePaginateQuery from "../../../hooks/api/usePaginateQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import dayjs from "dayjs";

const DoctorsContainer = () => {
    const {t} = useTranslation();
    const [page, setPage] = useState(0);
    const [searchKey,setSearchKey] = useState();

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

export default DoctorsContainer;
