import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import usePostQuery from "../../../hooks/api/usePostQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import {Button, Form, Input, Select} from "antd";
import useGetAllQuery from "../../../hooks/api/useGetAllQuery.js";
import {get, isEqual} from "lodash";
import usePutQuery from "../../../hooks/api/usePatchQuery.js";
import config from "../../../config.js";
import usePaginateQuery from "../../../hooks/api/usePaginateQuery.js";

const CreateEditProduct = ({itemData,setIsModalOpen,refetch}) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [selectedRole, setSelectedRole] = useState(null);
    const [searchKey, setSearchKey] = useState(null);

    const { mutate, isLoading } = usePostQuery({
        listKeyId: KEYS.admins_list,
    });
    const { mutate:mutateEdit, isLoading:isLoadingEdit } = usePutQuery({
        listKeyId: KEYS.admins_list,
        hideSuccessToast: false
    });

    useEffect(() => {
        form.setFieldsValue({
            role: get(itemData,'role'),
            username: get(itemData,'username'),
            password: get(itemData,'password'),
            districtIds: get(itemData,'districtIds'),
        });
    }, [itemData]);

    const {data:districts,isLoading:isLoadingDistricts} = useGetAllQuery({
        key: KEYS.district_list,
        url: URLS.district_list,
        params: {
            params: {
                size: 1000,
                search: searchKey,
            }
        },
    });

    const onFinish = (values) => {
        if (itemData){
            mutateEdit(
                { url: `${URLS.admin_edit}/${get(itemData,'id')}`, attributes: values },
                {
                    onSuccess: () => {
                        setIsModalOpen(false);
                        refetch()
                    },
                }
            );
        }else {
            mutate(
                { url: URLS.admin_add, attributes: values },
                {
                    onSuccess: () => {
                        setIsModalOpen(false);
                        refetch()
                    },
                }
            );
        }
    };

    return (
        <>
            <Form
                onFinish={onFinish}
                autoComplete="off"
                layout={"vertical"}
                form={form}
            >
                <Form.Item
                    label={t("Username")}
                    name="username"
                    rules={[{required: true,}]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={t("Password")}
                    name="password"
                    rules={[{required: true,}]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    label={t("Role")}
                    name="role"
                    rules={[{required: true,}]}>
                    <Select
                        placeholder={t("Role")}
                        options={Object.values(config.ROLES)?.map((item) => {
                            return {
                                value: item,
                                label: item
                            }
                        })}
                        onChange={(values) => {
                            setSelectedRole(values);
                        }}
                    />
                </Form.Item>

                {
                    isEqual(selectedRole,config.ROLES.ROLE_AREA_ADMIN) && (
                        <Form.Item
                            label={t("Districts")}
                            name="districtIds"
                            rules={[{required: true,}]}>
                            <Select
                                placeholder={t("District")}
                                showSearch
                                onSearch={(values) => {
                                    setSearchKey(values)
                                }}
                                allowClear
                                loading={isLoadingDistricts}
                                mode={"multiple"}
                                options={get(districts,'data.content',[])?.map((item) => {
                                    return {
                                        value: get(item,'id'),
                                        label: `${get(item,'nameUz')} / ${get(item,'nameRu')}`,
                                    }
                                })}
                            />
                        </Form.Item>
                    )
                }

                <Form.Item>
                    <Button block type="primary" htmlType="submit" loading={isLoading || isLoadingEdit}>
                        {itemData ? t("Edit") : t("Create")}
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default CreateEditProduct;
