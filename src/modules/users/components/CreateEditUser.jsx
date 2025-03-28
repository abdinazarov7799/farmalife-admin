import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import usePostQuery from "../../../hooks/api/usePostQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import {Button, Form, Input, Select, Switch} from "antd";
import useGetAllQuery from "../../../hooks/api/useGetAllQuery.js";
import {get, head} from "lodash";
import usePatchQuery from "../../../hooks/api/usePatchQuery.js";
import InputMask from 'react-input-mask';

const CreateEditUser = ({itemData,setIsModalOpen,refetch}) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [selectedRegionId, setSelectedRegionId] = useState(null);

    const { mutate, isLoading } = usePostQuery({
        listKeyId: KEYS.users_list,
    });
    const { mutate:mutateEdit, isLoading:isLoadingEdit } = usePatchQuery({
        listKeyId: KEYS.users_list,
        hideSuccessToast: false
    });

    const {data:districts,isLoading:isLoadingDistricts} = useGetAllQuery({
        key: `${KEYS.district_list}_${selectedRegionId}`,
        url: URLS.district_list,
        params: {
            params: {
                size: 1000,
                regionId: selectedRegionId
            }
        },
        enabled: !!selectedRegionId || !!get(itemData,'region')
    });
    const { data:regions,isLoading:isLoadingRegions } = useGetAllQuery({
        key: KEYS.region_list,
        url: URLS.region_list,
        params: {
            params: {
                size: 1000
            }
        }
    })
    console.log(itemData,'itemData')
    useEffect(() => {
        form.setFieldsValue({
            firstName: get(itemData,'firstname'),
            lastName: get(itemData,'lastName'),
            phoneNumber: get(itemData,'phoneNumber'),
            region: get(head(get(itemData,'region',[])),'id'),
            districtIds: get(itemData,'district')?.map(item => get(item,'id')),
            blocked: get(itemData,'blocked'),
        });
    }, [itemData]);

    const onFinish = (values) => {
        const {region,blocked,...formData} = values;

        if (itemData){
            mutateEdit(
                { url: `${URLS.user_edit}/${get(itemData,'id')}`, attributes: {...formData, blocked: !!blocked} },
                {
                    onSuccess: () => {
                        setIsModalOpen(false);
                        refetch()
                    },
                }
            );
        }else {
            mutate(
                { url: URLS.user_add, attributes: {...formData, blocked: !!blocked} },
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
                    rules={[
                        { required: true, message: t("Please enter your phone number") },
                    ]}
                >
                    <InputMask mask="+998999999999" maskChar="_">
                        {(inputProps) => <Input {...inputProps} />}
                    </InputMask>
                </Form.Item>
                <Form.Item
                    label={t("Region")}
                    name="region"
                    rules={[{required: true,}]}>
                    <Select
                        placeholder={t("Region")}
                        loading={isLoadingRegions}
                        options={get(regions,'data.content',[])?.map((item) => {
                            return {
                                value: get(item,'id'),
                                label: `${get(item,'nameUz')} / ${get(item,'nameRu')}`,
                            }
                        })}
                        onChange={(value) => setSelectedRegionId(value)}
                    />
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
                    <Switch defaultValue={false}/>
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
