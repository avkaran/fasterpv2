export const FormBootstrapTemplate=`
<Form
          method="post"
          noValidate
          validated={validated}
          id="frm_{formVar}"
          onSubmit={{formVar}OnSubmit}
        >
{formItems}
<Row className="mt-3">
            <Col md={12}>
              <div className="text-end">
                <Button type="submit" size="sm">
                  <i className="fa-solid fa-check me-2"></i> Update
                </Button>
              </div>
            </Col>
</Row>
</Form>`;