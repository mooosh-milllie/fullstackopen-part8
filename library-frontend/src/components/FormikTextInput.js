import { useField } from 'formik';
import styled from 'styled-components';


const Container = styled.div`

`;
const TextInput = styled.input`
  border: ${ (props) => props.inputError ? '1px solid #d73a4a' :  '1px solid gray'};
  margin-bottom: 15px;
`;
const ErrorText = styled.div`
  color: #d73a4a;
  margin-bottom: 7px;
`;
const FormikTextInput = ({ name }) => {
  const [field, meta, helpers] = useField(name);
  const showError = meta.touched && meta.error;
  
  return (
    <Container>
      <TextInput
        onBlur={() => helpers.setTouched(true)}
        value={field.value}
        onChange={({target}) => helpers.setValue(target.value)}
        error={showError}
        placeholder={field.name}
        inputError={showError}
      />
      {showError && <ErrorText>{meta.error}</ErrorText>}
    </Container>
  );
};

export default FormikTextInput;