import React, {Component, PropTypes} from 'react';
import {reduxForm} from 'redux-form';
import {createPost} from '../actions/index';
import {Link} from 'react-router';

class PostsNew extends Component {
  static contextTypes = {
    router: PropTypes.object
  };

  onSubmit(props){
    this.props.createPost(props)
    .then(()=>{
      //blog post has created, navigate the user to tye index
      //we navigate by calling this.context.router.push with the
      // new path to navigate to
      this.context.router.push('/posts/')

    });
  }

  render(){
    //const handleSubmit = this.props.handleSubmit
    //const title = this.props.fields.title
    const {fields:{title, categories, content}, handleSubmit} = this.props;
    return(
      <form className="form-post"  onSubmit={handleSubmit(this.onSubmit.bind(this))}>
        <h3>Create A New Post</h3>

        <div className={`form-group ${title.touched && title.invalid ? 'has-error' : ''}`}>
          <label className="control-label">Title</label>
          <input type="text" className="form-control" /*onChange={title.onChange}*/ {...title}/>
          <div className="help-block">
            {title.touched ? title.error : ''}
          </div>
        </div>

        <div className={`form-group ${categories.touched && categories.invalid ? 'has-error' : ''}`}>
          <label className="control-label">Categories</label>
          <input type="text" className="form-control" {...categories}/>
          <div className="help-block">
            {categories.touched ? categories.error : ''}
          </div>
        </div>

        <div className={`form-group ${content.touched && content.invalid ? 'has-error' : ''}`}>
          <label className="control-label">Content</label>
          <textarea type="text" className="form-control" {...content}/>
          <div className="help-block">
            {content.touched ? content.error : ''}
          </div>
        </div>

        <button type="submit" className="btn btn-primary">Save</button>
        <Link to="/posts/" className="btn btn-danger">Cancel</Link>
      </form>
    );
  }
}

function validate(values){
  const errors = {};

  if(!values.title){
    errors.title = 'Enter a username';
  }

  if(!values.categories){
    errors.categories = 'Enter categories';
  }

  if(!values.content){
    errors.content = 'Enter some content';
  }

  return errors;
}

//connect: first argument is mapStateToProps, 2nd is mapDispatchToProps
//reduxForm: 1st is form config, 2nd is mapStateToProps, 3rd is mapDispatchToProps

export default reduxForm({
  form: 'PostsNewForm',
  fields: ['title', 'categories', 'content'],
  validate
}, null, {createPost})(PostsNew);
