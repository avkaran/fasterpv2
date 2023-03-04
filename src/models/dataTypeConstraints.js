const dataTypeConstraints = [
   {
      dataType: "Text",
      possibleConstraints: "None,AutoCode,PrimaryKey,PrimaryKey2",
      defaultConstraint: "None",
      template: '<Input placeholder="{placeHolder}" defaultValue={defaultValue} />',
      templateBootstrap: `<Form.Control
      type="text"
      name={name}
      placeholder="{placeHolder}"
      defaultValue={defaultValue}
      className="fw-bold"
      size="sm"
      required
    />`,
      functions: ``,
   },
   {
      dataType: "Paragraph",
      possibleConstraints: "None",
      defaultConstraint: "None",
      template: '<Input.TextArea rows={3} defaultValue={defaultValue} />',
      templateBootstrap: ` <Form.Control
      as="textarea"
      className="fw-bold"
      name={name}
      placeholder="{placeHolder}"
      defaultValue={defaultValue}
      rows={3}
      required
    />`,
      functions: ``,
   },
   {
      dataType: "Integer",
      possibleConstraints: "None,PrimaryKey",
      defaultConstraint: "None",
      template: `<InputNumber placeholder="{placeHolder}" type="number" defaultValue={defaultValue}  style={{width:'100%'}}/>`,
      templateBootstrap: `<Form.Control
      type="number"
      name={name}
      placeholder="{placeHolder}"
      defaultValue={defaultValue}
      size="sm"
      className="fw-bold text-end"
      required
    />`,
      functions: ``,
   },
   {
      dataType: "Float",
      possibleConstraints: "None",
      defaultConstraint: "None",
      template: '<InputNumber placeholder="{placeHolder}" type="number" defaultValue={defaultValue} />',
      templateBootstrap: `<Form.Control
      type="number"
      name={name}
      defaultValue={defaultValue}
      size="sm"
      className="fw-bold text-end"
      required
    />`,
      functions: ``,
   },
   {
      dataType: "Password",
      possibleConstraints: "None",
      defaultConstraint: "None",
      template: '<Input.Password placeholder="{placeHolder}" defaultValue={defaultValue} />',
      templateBootstrap: `<Form.Control
      type="password"
      name={name}
      placeholder="{placeHolder}"
      defaultValue={defaultValue}
      size="sm"
      className="fw-bold text-end"
      required
    />`,
      functions: ``,
   },
   {
      dataType: "Email",
      possibleConstraints: "None,PrimaryKey,ForeignKey",
      defaultConstraint: "None",
      template: '<Input placeholder="{placeHolder}" defaultValue={defaultValue} />',
      templateBootstrap: `<Form.Control
      type="email"
      name={name}
      placeholder="{placeHolder}"
      defaultValue={defaultValue}
      size="sm"
      className="fw-bold text-end"
      required
    />`,
      functions: ``,
   },
   {
      dataType: "Select",
      possibleConstraints: "ForeignKey,Collections,CustomCollection",
      defaultConstraint: "Collections",
      template: `
    <Select
    showSearch
    placeholder="{placeHolder}"
    defaultValue={defaultValue}
    optionFilterProp="children"
    //onChange={{nameVar}OnChange}
    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
   >
   {OptionCollection}
   </Select>`,
      templateBootstrap: `<Form.Control
   type="select"
   name={name}
   placeholder="{placeHolder}"
   defaultValue={defaultValue}
   size="sm"
   className="fw-bold form-select form-select-sm"
   required
 >
 {OptionCollection}
 </Form.Control>`,
      functions: ``,
   },
   {
      dataType: "Country",
      possibleConstraints: "None",
      defaultConstraint: "None",
      template: `
      <CountryDropdown
      className="ant-input"
      value={country}
      onChange={(val) => setCountry(val)} />`,
      functions: ``,
   },
   {
      dataType: "State",
      possibleConstraints: "None",
      defaultConstraint: "None",
      template: `
      <RegionDropdown
      country={country}
      className="ant-input"
      // value={viewData.state}

      //onChange={(val) => this.selectRegion(val)} 
      />`,
      functions: ``,
   },
   {
      dataType: "MultiSelect",
      possibleConstraints: "ForeignKey,Collections,CustomCollection",
      defaultConstraint: "Collections",
      template: `
    <Select
    placeholder="{placeHolder}"
    defaultValue={defaultValue}
    mode="multiple"
    style={{
      width: '100%',
    }}
    optionLabelProp="label"
    //onChange={{nameVar}OnChange}
  >
  {OptionCollection}
  </Select>`,
  templateBootstrap:``,
      functions: ``,
   },
   {
      dataType: "Checkbox",
      possibleConstraints: "Collections,DynamicBoxNames",
      defaultConstraint: "Collections",
      template: `
      <Checkbox checked={defaultValue}>{label}</Checkbox>`,
      templateBootstrap:`<Form.Check
      type="checkbox"
      label={label}
      name={name}
    />`,
      functions: ``,
   },
   {
      dataType: "Radiobutton",
      possibleConstraints: "Collections",
      defaultConstraint: "Collections",
      template: `
      <Radio.Group optionType="default" >
         {OptionCollection}
      </Radio.Group>
      `,
      templateBootstrap:``,
      functions: ``,
   },
   {
      dataType: "DateOnly",
      possibleConstraints: "None",
      defaultConstraint: "None",
      template: `
      <Space direction="vertical">
            <DatePicker onChange={{nameVar}OnChange} format='DD/MM/YYYY'
               defaultValue={defaultValue}
               //disabledDate={{nameVar}Disabled}
               allowClear={false}
            />
      </Space>`,
      templateBootstrap:`<Form.Control
      type="date"
      name={name}
      className="fw-bold"
      size="sm"
      //max={toDate}
      required
    />`,
      functions: `
      const onChange={{nameVar}OnChange} = (date) => {

         addForm.setFieldsValue({
             {name}: moment(date).format('YYYY-MM-DD')
         })
     };
     const {{nameVar}Disabled} = (current) => {
      // Can not select days before today and today
      return current && current > moment().subtract(18, "years");
  };`,
   },
   {
      dataType: "DateTime",
      possibleConstraints: "None",
      defaultConstraint: "None",
      template: `
      <Space direction="vertical">
         <DatePicker onChange={{nameVar}OnChange} format='DD/MM/YYYY'
            defaultValue={defaultValue}
            disabledDate={{nameVar}Disabled}
            allowClear={false}
         />
      </Space>`,
      templateBootstrap:``,
      functions: ``,
   },
   {
      dataType: "Time",
      possibleConstraints: "None",
      defaultConstraint: "None",
      template: `
      <Space direction="vertical">
      <DatePicker onChange={{nameVar}OnChange} format='DD/MM/YYYY'
         defaultValue={defaultValue}
         disabledDate={{nameVar}Disabled}
         allowClear={false}
      />
      </Space>`,
      templateBootstrap:``,
      functions: ``,

   },
   {
      dataType: "File",
      possibleConstraints: "None",
      defaultConstraint: "None",
      template: '',
      functions: ``,
   },
   {
      dataType: "Image",
      possibleConstraints: "None",
      defaultConstraint: "None",
      template: `
      <ImageUpload
      name={name}
      defaultImage={defaultValue}
      storeFileName={viewData.photo ? viewData.photo : 'public/uploads/' + new Date().valueOf() + '.jpg'}
      onFinish={{nameVar}OnFinish}
      />`,
      templateBootstrap:``,
      functions: ``,
   },
   {
      dataType: "MobileNo",
      possibleConstraints: "None",
      defaultConstraint: "None",
      template: `
      <PhoneInput
      country={'in'}
      defaultValue={defaultValue}
      //onChange={phone => {}}
      />`,
      templateBootstrap:``,
      functions: ``,
   },
   {
      dataType: "DynamicBox",
      possibleConstraints: "None",
      defaultConstraint: "None",
      template: '',
      functions: ``,
   },
   {
      dataType: "Currency",
      possibleConstraints: "None",
      defaultConstraint: "None",
      template: '',
      functions: ``,
   },
   {
      dataType: "Barcode",
      possibleConstraints: "None",
      defaultConstraint: "None",
      template: '',
      functions: ``,
   },
   {
      dataType: "ThumbImage",
      possibleConstraints: "ImageColumn",
      defaultConstraint: "ImageColumn",
      template: '',
      functions: ``,
   },
   {
      dataType: "Audio",
      possibleConstraints: "None",
      defaultConstraint: "None",
      template: '',
      functions: ``,
   },
   {
      dataType: "CheckboxList",
      possibleConstraints: "Collections,ForeignKey",
      defaultConstraint: "Collections",
      template: '',
      functions: ``,
   },
   {
      dataType: "Fingerprint",
      possibleConstraints: "None",
      defaultConstraint: "None",
      template: '',
      functions: ``,
   },
]
export default dataTypeConstraints;