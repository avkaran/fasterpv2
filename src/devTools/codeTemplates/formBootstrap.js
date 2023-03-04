export const FormBootstrapTemplate=`<Form
name="basic"
form={{formVar}}
labelAlign="left"
labelCol={{ span: 8 }}
wrapperCol={{ span: 20 }}
initialValues={{ remember: true }}
onFinish={{formVar}OnFinish}
autoComplete="off"
>
{formItems}
<FormItem wrapperCol={{ offset: 10, span: 24 }}>
<Space>
    <Button size="large" type="outlined"  onClick={()=>{formVar}.resetFields()}>
        Reset
    </Button>
    <MyButton size="large" type="primary" htmlType="submit">
       Save
    </MyButton>
</Space>

</FormItem>

</Form>`;