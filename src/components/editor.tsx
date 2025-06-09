import React from "react";

interface Param {
  id: number;
  name: string;
  type: `string`;
}

interface Props {
  params: Param[];
}

interface Product {
  name: string;
  params: {
    purpose: string;
    length: number;
    [key: string]: string | number;
  };
}

interface State {
  products: Product[];
  selectedProduct: string;
  newProduct: string;
  newPurpose: string;
  newLength: number;
  isEditing: boolean;
  isAddingProduct: boolean;
  isAddingProperty: boolean;
  newKey: string;
  newValue: string | number;
  editingKey: string;
  editingValue: string;
  editingParams: Product;
}

class Editor extends React.Component<{}, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      products: [
        {
          name: "conditioner",
          params: { purpose: "humidification", length: 70 },
        },
        {
          name: "freezer",
          params: { purpose: "freezing", length: 80 },
        },
        { name: "microwave", params: { purpose: "warming ", length: 50 } },
      ],
      selectedProduct: "",
      newProduct: "",
      newPurpose: "",
      newLength: 0,
      isEditing: false,
      isAddingProduct: false,
      isAddingProperty: false,
      newKey: "",
      newValue: "",
      editingKey: "",
      editingValue: "",
      editingParams: {
        name: "",
        params: {
          purpose: "",
          length: 0,
        },
      },
    };
  }

  buttonStyle = {
    width: "1.5rem",
    height: "1.5rem",
  };

  chooseProduct = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ selectedProduct: event.target.value });
  };

  exitEditingProperty = () => {
    this.setState({ isAddingProperty: false, selectedProduct: "" });
  };

  removeProduct = () => {
    const { selectedProduct, products } = this.state;
    if (selectedProduct) {
      this.setState({
        products: products.filter((el) => el.name !== selectedProduct),
        selectedProduct: "",
      });
    }
  };

  removeProperty = (key: string, productName: string) => {
    const { products } = this.state;

    const updatedProducts = products.map((product) => {
      if (product.name === productName) {
        const { params, ...rest } = product;
        const { ...newParams } = params;
        delete newParams[key];
        return {
          ...rest,
          params: newParams,
        };
      }
      return product;
    });

    this.setState({ products: updatedProducts });
  };

  editProperty = (key: string, productName: string) => {
    // const { editingKey, editingValue } = this.state;
    this.removeProperty(key, productName);
    this.addProperty();
  };

  handleToProduct = () => {
    this.setState({ isEditing: true });
  };

  addProduct = () => {
    this.setState({ isAddingProduct: true });
  };

  addProperty = () => {
    this.setState({ isAddingProperty: true });
  };

  saveProperty = () => {
    const { selectedProduct, newKey, newValue, products } = this.state;

    if (newKey && selectedProduct) {
      const updatedProducts = products.map((product) => {
        if (product.name === selectedProduct) {
          return {
            ...product,
            params: {
              ...product.params,
              [newKey]: newValue,
            },
          };
        }
        return product;
      });

      this.setState({
        products: updatedProducts,
        newKey: "",
        newValue: "",
        isAddingProperty: false,
      });
    }
  };

  saveProduct = () => {
    const { newProduct, newPurpose, newLength, products } = this.state;

    if (newProduct && newPurpose && newLength > 0) {
      const newProductEntry = {
        name: newProduct,
        params: {
          purpose: newPurpose,
          length: newLength,
        },
      };

      this.setState({
        products: [...products, newProductEntry],
        newProduct: "",
        newPurpose: "",
        newLength: 0,
        isAddingProduct: false,
      });
    } else {
      alert("please fill all fields");
    }
  };

  productBack = () => {
    this.setState({ isAddingProduct: false });
  };

  propertyBack = () => {
    this.setState({
      isAddingProperty: false,
      isEditing: false,
      selectedProduct: "",
    });
  };

  render() {
    const { isEditing, isAddingProduct, newProduct, newPurpose, newLength } =
      this.state;

    return (
      <div className="wrapper">
        {isAddingProduct ? (
          <div
            className="add"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <h2>add new product</h2>
            <input
              type="text"
              placeholder="name"
              value={newProduct}
              onChange={(e) => this.setState({ newProduct: e.target.value })}
              style={{ marginBottom: "1rem" }}
            />
            <input
              type="text"
              placeholder="purpose"
              value={newPurpose}
              onChange={(e) => this.setState({ newPurpose: e.target.value })}
              style={{ marginBottom: "1rem" }}
            />
            <input
              type="number"
              placeholder="length in cm"
              value={newLength === 0 ? "" : newLength.toString()}
              onChange={(e) =>
                this.setState({
                  newLength: e.target.value === "" ? 0 : Number(e.target.value),
                })
              }
              style={{ marginBottom: "1rem" }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <button
                onClick={this.productBack}
                style={{ ...this.buttonStyle, marginRight: "0.5rem" }}
              >
                &larr;
              </button>
              <button
                onClick={this.saveProduct}
                style={{ ...this.buttonStyle, marginLeft: "0.5rem" }}
              >
                v
              </button>
            </div>
          </div>
        ) : !isEditing ? (
          <div
            className="product"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                margin: "0.5rem 1rem",
              }}
            >
              <button
                style={{ ...this.buttonStyle, marginRight: "0.5rem" }}
                onClick={this.addProduct}
              >
                +
              </button>
              <select
                id="product"
                value={this.state.selectedProduct}
                onChange={this.chooseProduct}
              >
                <option value="">choose...</option>
                {this.state.products.map((el, i) => (
                  <option key={i} value={el.name}>
                    {el.name}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", margin: "0.5rem 1rem" }}>
              <button
                style={{
                  ...this.buttonStyle,
                  flex: "1",
                  marginRight: "0.5rem",
                }}
                onClick={this.handleToProduct}
                disabled={!this.state.selectedProduct}
              >
                edit
              </button>
              <button
                style={{ ...this.buttonStyle, flex: "1" }}
                onClick={this.removeProduct}
                disabled={!this.state.selectedProduct}
              >
                remove
              </button>
            </div>
          </div>
        ) : (
          <div className="edit" style={{ textAlign: "center" }}>
            <h2>{this.state.selectedProduct}</h2>
            {this.state.products.map((el) => {
              if (el.name === this.state.selectedProduct) {
                return Object.entries(el.params).map(([key, value]) => (
                  <div
                    key={key}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      minWidth: "20rem",
                      margin: "0.5rem 0",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        flexGrow: "1",
                      }}
                    >
                      <div style={{ marginRight: "1rem" }}>{key}:</div>
                      <div>{key === "length" ? `${value} sm` : value}</div>
                    </div>
                    <div className="nav" style={{ marginLeft: "1rem" }}>
                      <button
                        style={{ ...this.buttonStyle, marginRight: "0.5rem" }}
                        onClick={() => this.editProperty(key, el.name)}
                        disabled={["purpose", "length"].includes(key)}
                      >
                        &#177;
                      </button>

                      <button
                        style={{ ...this.buttonStyle, marginLeft: "0.5rem" }}
                        onClick={() => this.removeProperty(key, el.name)}
                        disabled={["purpose", "length"].includes(key)}
                      >
                        x
                      </button>
                    </div>
                  </div>
                ));
              }

              return null;
            })}
            {this.state.isAddingProperty && (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexGrow: "1",
                  }}
                >
                  <input
                    style={{ width: "5rem" }}
                    type="text"
                    placeholder="property"
                    value={this.state.newKey}
                    onChange={(e) => this.setState({ newKey: e.target.value })}
                  />
                  <input
                    style={{ width: "5rem" }}
                    type="text"
                    placeholder="value"
                    value={this.state.newValue}
                    onChange={(e) =>
                      this.setState({ newValue: e.target.value })
                    }
                  />
                </div>
                <button
                  onClick={this.saveProperty}
                  style={{ ...this.buttonStyle, marginLeft: "3.3rem" }}
                >
                  v
                </button>
              </div>
            )}

            <div className="nav" style={{ margin: "1rem 0" }}>
              <button
                style={{ ...this.buttonStyle, marginRight: "0.5rem" }}
                onClick={this.propertyBack}
              >
                &larr;
              </button>
              <button
                style={{ ...this.buttonStyle, marginRight: "0.5rem" }}
                onClick={this.addProperty}
              >
                +
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Editor;
