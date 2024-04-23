import React, { PureComponent } from 'react';
import { View, FlatList, ScrollView, Dimensions } from 'react-native';
import AnimeListing from './AnimeListing';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class SearchResults extends PureComponent {
    render() {
        const { searchList } = this.props; // Destructure searchList from props

        return (
            <FlatList
            style={{marginLeft: windowWidth/5,width:windowWidth}}
                data={searchList} // Use searchList from props
                keyExtractor={(item) => item.mal_id.toString()} // Use toString() to ensure key is a string
                numColumns={2}
                renderItem={({ item }) => (
                    <AnimeListing anime={item} />
                )}>
            </FlatList>
                
            
        );
    }
}

export default SearchResults;
