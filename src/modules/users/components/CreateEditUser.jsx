import React, {useEffect} from 'react';
import {useTranslation} from "react-i18next";
import usePostQuery from "../../../hooks/api/usePostQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import {Button, Form, Input, Select, Switch} from "antd";
import useGetAllQuery from "../../../hooks/api/useGetAllQuery.js";
import {get} from "lodash";
import usePutQuery from "../../../hooks/api/usePatchQuery.js";

const CreateEditUser = ({itemData,setIsModalOpen,refetch}) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();

    const { mutate, isLoading } = usePostQuery({
        listKeyId: KEYS.users_list,
    });
    const { mutate:mutateEdit, isLoading:isLoadingEdit } = usePutQuery({
        listKeyId: KEYS.users_list,
        hideSuccessToast: false
    });

    const {data:districts,isLoading:isLoadingDistricts} = useGetAllQuery({
        key: KEYS.district_list,
        url: URLS.district_list,
        params: {
            params: {
                size: 1000,
            }
        },
    });
    useEffect(() => {
        form.setFieldsValue({
            firstName: get(itemData,'firstName'),
            lastName: get(itemData,'lastName'),
            phoneNumber: get(itemData,'phoneNumber'),
            districtIds: get(itemData,'districtIds'),
            blocked: get(itemData,'blocked'),
        });
    }, [itemData]);

    const onFinish = (values) => {
        if (itemData){
            mutateEdit(
                { url: `${URLS.user_edit}/${get(itemData,'id')}`, attributes: values },
                {
                    onSuccess: () => {
                        setIsModalOpen(false);
                        refetch()
                    },
                }
            );
        }else {
            mutate(
                { url: URLS.user_add, attributes: values },
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
                    label={t("First name")}
                    name="firstName"
                    rules={[{required: true,}]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={t("Last name")}
                    name="lastName"
                    rules={[{required: true,}]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={t("Phone number")}
                    name="phoneNumber"
                    rules={[{required: true,}]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={t("Districts")}
                    name="districtIds"
                    rules={[{required: true,}]}>
                    <Select
                        placeholder={t("District")}
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
                <Form.Item
                    label={t("Blocked")}
                    name="blocked"
                >
                    <Switch />
                </Form.Item>

                <Form.Item>
                    <Button block type="primary" htmlType="submit" loading={isLoading || isLoadingEdit}>
                        {itemData ? t("Edit") : t("Create")}
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default CreateEditUser;
