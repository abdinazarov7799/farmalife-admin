import React, {useEffect} from 'react';
import {useTranslation} from "react-i18next";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import {Button, Form, Input} from "antd";
import {get} from "lodash";
import usePatchQuery from "../../../hooks/api/usePatchQuery.js";

const CreateEditProduct = ({itemData,setIsModalOpen}) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();

    const { mutate, isLoading } = usePatchQuery({
        listKeyId: KEYS.specializations_list,
    });
    const { mutate:mutateEdit, isLoading:isLoadingEdit } = usePatchQuery({
        listKeyId: KEYS.specializations_list,
    });

    useEffect(() => {
        form.setFieldsValue({
            ...itemData
        });
    }, [itemData]);

    const onFinish = (values) => {
        if (itemData){
            mutateEdit(
                { url: `${URLS.specializations_edit}/${get(itemData,'id')}?name=${values?.name}` },
                {
                    onSuccess: () => {
                        setIsModalOpen(false);
                    },
                }
            );
        }else {
            mutate(
                { url: `${URLS.specializations_add}?name=${values?.name}` },
                {
                    onSuccess: () => {
                        setIsModalOpen(false);
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
                    label={t("Name")}
                    name="name"
                    rules={[{required: true,}]}
                >
                    <Input />
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

export default CreateEditProduct;
