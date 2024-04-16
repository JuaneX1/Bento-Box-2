import React, { PureComponent } from 'react';
import { View, FlatList, ScrollView, Dimensions,Text } from 'react-native';
import AnimeListing from './AnimeListing';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
  /*<FlatList
            style={{width:windowWidth}}
                data={favorites} // Use searchList from props
                keyExtractor={(item) => item.mal_id + Math.random()} // Use toString() to ensure key is a string
                numColumns={2}
                renderItem={({ item }) => (
                    <AnimeListing anime={item} />
                )}>
                </FlatList>
                
                <ScrollView>
                                {favorites.map((item, index) => (
                                    <Text key={index}>{item.mal_id}</Text>
                                ))}
                            </ScrollView>
                
                */
               
                class FavoriteAnime extends PureComponent {
                    render() {
                        const { favorites } = this.props; // Destructure searchList from props
                        console.log(favorites);
                        return (
                                    <FlatList
                    style={{width:windowWidth}}
                        data={favorites} // Use searchList from props
                        keyExtractor={(item) => item.mal_id + Math.random()} // Use toString() to ensure key is a string
                        numColumns={2}
                        renderItem={({ item }) => (
                            <AnimeListing anime={item} />
                        )}>
                        </FlatList>
                            
                        );
                    }
                }
                
                export default FavoriteAnime;